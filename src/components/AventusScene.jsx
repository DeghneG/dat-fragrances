import { useEffect, useRef, useState } from 'react'
import ProductVisual from './ProductVisual'

const GLASS_VS = `
  varying vec3 vN; varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`
const GLASS_FS = `
  uniform float base; uniform float edge;
  varying vec3 vN; varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
    vec3 col = mix(vec3(0.80, 0.86, 0.84), vec3(1.0, 0.98, 0.95), f);
    gl_FragColor = vec4(col, base + edge * f);
  }`

// Procedural 3D Creed Aventus, proportioned from the product photo (units: 1 = ~69 px of the photo):
// total height 4.2, body 2.18 wide, S-curve shoulders into a short neck, black band across the
// lower-middle of the body with the logo on clear glass above it, tapered faceted black cap.
export default function AventusScene({ product }) {
  const mount = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      try {
        const THREE = await import('three')
        const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
        if (disposed || !mount.current) return

        const el = mount.current
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.1
        renderer.setClearColor(0x000000, 0)
        el.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const pmrem = new THREE.PMREMGenerator(renderer)
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

        const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
        camera.position.set(0, 2.3, 11.5)
        camera.lookAt(0, 2.05, 0)

        const key = new THREE.DirectionalLight(0xfff1d6, 2.4)
        key.position.set(4, 6, 6)
        scene.add(key)
        const rim = new THREE.PointLight(0xd4b97e, 70, 22)
        rim.position.set(-4, 3, -4)
        scene.add(rim)
        const fill = new THREE.PointLight(0xffffff, 18, 20)
        fill.position.set(5, 1, 3)
        scene.add(fill)

        // ---- geometry: sweep a squircle cross-section along a height profile
        const sgnPow = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p)
        const sweep = (rings, segs = 72) => {
          const pos = []
          const uv = []
          const idx = []
          rings.forEach((r, i) => {
            for (let j = 0; j <= segs; j++) {
              const a = (j / segs) * Math.PI * 2
              pos.push(sgnPow(Math.cos(a), 2 / r.n) * r.hx, r.y, sgnPow(Math.sin(a), 2 / r.n) * r.hz)
              uv.push(j / segs, i / (rings.length - 1))
            }
          })
          for (let i = 0; i < rings.length - 1; i++) {
            for (let j = 0; j < segs; j++) {
              const a = i * (segs + 1) + j
              const b = a + segs + 1
              idx.push(a, a + 1, b, a + 1, b + 1, b)
            }
          }
          const g = new THREE.BufferGeometry()
          g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
          g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
          g.setIndex(idx)
          g.computeVertexNormals()
          return g
        }

        // measurements (from the photo)
        const HW = 1.09 // body half width
        const HD = 0.72 // body half depth
        const NECK = 0.28 // neck half width
        const Y_SHOULDER = 2.47 // where the body stops being straight
        const Y_NECK = 3.0 // where the shoulder meets the neck
        const Y_TOP = 3.33 // top of the glass neck
        const BAND0 = 0.28
        const BAND1 = 1.77

        const smooth = (u) => u * u * (3 - 2 * u)
        const shape = (y, inset = 0) => {
          let e = 1
          let n = 5
          if (y > Y_SHOULDER) {
            const u = Math.min(1, (y - Y_SHOULDER) / (Y_NECK - Y_SHOULDER))
            e = 1 - smooth(Math.pow(u, 0.9))
            n = 5 - 2.7 * u
          }
          if (y >= Y_NECK) {
            e = 0
            n = 2.3
          }
          let k = 1
          if (y < 0.07) k = 0.9 + (y / 0.07) * 0.1 // softly rounded base
          const hx = (NECK + (HW - NECK) * e) * k - inset
          const hz = (NECK + (HD - NECK) * e) * k - inset
          return { y, hx: Math.max(hx, 0.02), hz: Math.max(hz, 0.02), n }
        }
        const ringsFor = (y0, y1, steps, inset = 0) => {
          const out = []
          for (let i = 0; i <= steps; i++) out.push(shape(y0 + ((y1 - y0) * i) / steps, inset))
          return out
        }

        // ---- materials
        const mkGlass = (base, edge) =>
          new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { base: { value: base }, edge: { value: edge } }, vertexShader: GLASS_VS, fragmentShader: GLASS_FS })
        const glass = mkGlass(0.03, 0.85)
        const glassBase = mkGlass(0.14, 0.9)
        const liquid = new THREE.MeshPhysicalMaterial({ color: 0xe6e8d2, roughness: 0.05, transparent: true, opacity: 0.09, envMapIntensity: 0.4, depthWrite: false })
        const blackGloss = new THREE.MeshPhysicalMaterial({ color: 0x040404, metalness: 0.2, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.8, flatShading: true })
        const silver = new THREE.MeshStandardMaterial({ color: 0xdcdcd8, metalness: 1, roughness: 0.2, envMapIntensity: 1.8 })

        // brushed-metal band texture (fine horizontal grain)
        const brushedCanvas = document.createElement('canvas')
        brushedCanvas.width = 256
        brushedCanvas.height = 512
        const bg = brushedCanvas.getContext('2d')
        bg.fillStyle = '#0c0c0d'
        bg.fillRect(0, 0, 256, 512)
        for (let i = 0; i < 900; i++) {
          const y = Math.random() * 512
          const a = Math.random() * 0.06
          bg.fillStyle = `rgba(${Math.random() > 0.65 ? '255,255,255' : '0,0,0'},${a})`
          bg.fillRect(0, y, 256, Math.random() * 1.2 + 0.3)
        }
        const brushedTex = new THREE.CanvasTexture(brushedCanvas)
        brushedTex.colorSpace = THREE.SRGBColorSpace
        brushedTex.wrapS = THREE.RepeatWrapping
        brushedTex.anisotropy = 8
        const brushed = new THREE.MeshStandardMaterial({ map: brushedTex, color: 0xa8a8a8, metalness: 0.25, roughness: 0.5, envMapIntensity: 0.3 })

        const bottle = new THREE.Group()
        const add = (geo, mat, order = 0) => {
          const m = new THREE.Mesh(geo, mat)
          m.renderOrder = order
          bottle.add(m)
          return m
        }

        // glass body with neck, heavy glass base, pale juice up to the shoulder
        add(sweep(ringsFor(0, Y_TOP, 110)), glass, 3)
        add(sweep(ringsFor(0, 0.3, 8, 0.03)), glassBase, 2)
        const juiceRings = ringsFor(0.3, 2.62, 50, 0.1)
        const top = juiceRings[juiceRings.length - 1]
        juiceRings.push({ ...top, hx: 0.001, hz: 0.001 })
        add(sweep(juiceRings), liquid, 1)

        // black brushed band, slightly proud of the glass
        const bandRings = [
          { y: BAND0, hx: HW * 0.985, hz: HD * 0.985, n: 5 },
          { y: BAND0 + 0.02, hx: HW * 1.013, hz: HD * 1.013, n: 5 },
          { y: BAND1 - 0.02, hx: HW * 1.013, hz: HD * 1.013, n: 5 },
          { y: BAND1, hx: HW * 0.985, hz: HD * 0.985, n: 5 },
        ]
        const bandGeo = sweep(bandRings)
        const bandUV = bandGeo.attributes.uv
        for (let i = 0; i < bandUV.count; i++) bandUV.setX(i, bandUV.getX(i) * 3)
        add(bandGeo, brushed, 0)
        // thin metallic rims along the band edges
        ;[BAND0 + 0.012, BAND1 - 0.012].forEach((y) => {
          add(sweep([
            { y: y - 0.014, hx: HW * 1.018, hz: HD * 1.018, n: 5 },
            { y: y + 0.014, hx: HW * 1.018, hz: HD * 1.018, n: 5 },
          ]), silver, 0)
        })

        // collar and faceted cap
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.07, 48), silver)
        collar.position.y = Y_TOP - 0.02
        bottle.add(collar)
        const capProfile = [
          [0.0, 0.0], [0.4, 0.0], [0.405, 0.04], [0.47, 0.78], [0.46, 0.83], [0.4, 0.87], [0.0, 0.87],
        ].map(([x, y]) => new THREE.Vector2(x, y))
        const cap = new THREE.Mesh(new THREE.LatheGeometry(capProfile, 8), blackGloss)
        cap.position.y = Y_TOP + 0.01
        cap.rotation.y = Math.PI / 8
        bottle.add(cap)

        // textures
        const makeTex = (w, h, draw) => {
          const c = document.createElement('canvas')
          c.width = w
          c.height = h
          draw(c.getContext('2d'), w, h)
          const t = new THREE.CanvasTexture(c)
          t.colorSpace = THREE.SRGBColorSpace
          t.anisotropy = 8
          return t
        }
        // silver label with double border
        const labelTex = makeTex(1024, 560, (g, w, h) => {
          const gr = g.createLinearGradient(0, 0, w, h)
          gr.addColorStop(0, '#f7f7f5')
          gr.addColorStop(0.5, '#cdcdc9')
          gr.addColorStop(1, '#f1f1ee')
          g.fillStyle = gr
          g.fillRect(0, 0, w, h)
          g.strokeStyle = '#161616'
          g.lineWidth = 6
          g.strokeRect(20, 20, w - 40, h - 40)
          g.lineWidth = 2
          g.strokeRect(40, 40, w - 80, h - 80)
          g.fillStyle = '#121212'
          g.textAlign = 'center'
          g.font = '600 104px "Cormorant Garamond", Georgia, serif'
          g.fillText('AVENTUS', w / 2, h - 118)
          g.lineWidth = 3
          g.beginPath()
          g.arc(w / 2, 170, 40, 0, Math.PI * 2)
          g.stroke()
          g.beginPath()
          g.moveTo(w / 2 - 26, 184)
          g.quadraticCurveTo(w / 2, 112, w / 2 + 26, 184)
          g.stroke()
        })
        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(1.41, 0.76),
          new THREE.MeshStandardMaterial({ map: labelTex, metalness: 0.5, roughness: 0.3, envMapIntensity: 1 }),
        )
        label.position.set(0, 1.1, HD * 1.013 + 0.004)
        bottle.add(label)

        // CREED logo on the clear glass above the band
        const logoTex = makeTex(1024, 450, (g, w) => {
          g.fillStyle = '#f2ebdc'
          g.strokeStyle = '#f2ebdc'
          g.textAlign = 'center'
          g.font = '700 210px "Cormorant Garamond", Georgia, serif'
          g.fillText('CREED', w / 2, 205)
          g.lineWidth = 10
          g.lineCap = 'round'
          g.beginPath()
          g.moveTo(w * 0.18, 245)
          g.bezierCurveTo(w * 0.42, 270, w * 0.58, 340, w * 0.88, 392)
          g.stroke()
          g.beginPath()
          g.moveTo(w * 0.82, 245)
          g.bezierCurveTo(w * 0.58, 270, w * 0.42, 340, w * 0.12, 392)
          g.stroke()
        })
        const logo = new THREE.Mesh(new THREE.PlaneGeometry(1.38, 0.61), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false }))
        logo.position.set(0, 2.06, HD + 0.012)
        logo.renderOrder = 4
        bottle.add(logo)

        bottle.position.y = 0.02
        scene.add(bottle)

        // ---- sizing and loop
        const size = () => {
          const w = el.clientWidth
          const h = el.clientHeight
          renderer.setSize(w, h, false)
          renderer.domElement.style.width = '100%'
          renderer.domElement.style.height = '100%'
          camera.aspect = w / h
          camera.updateProjectionMatrix()
        }
        size()
        const ro = new ResizeObserver(size)
        ro.observe(el)

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const clock = new THREE.Clock()
        let raf = 0
        bottle.rotation.y = -0.4
        const tick = () => {
          const dt = clock.getDelta()
          if (!reduce) bottle.rotation.y += dt * 0.38
          bottle.position.y = 0.02 + (reduce ? 0 : Math.sin(clock.elapsedTime * 0.9) * 0.04)
          renderer.render(scene, camera)
          raf = requestAnimationFrame(tick)
        }
        tick()

        cleanup = () => {
          cancelAnimationFrame(raf)
          ro.disconnect()
          scene.traverse((o) => {
            if (o.geometry) o.geometry.dispose()
            if (o.material) {
              if (o.material.map) o.material.map.dispose()
              o.material.dispose()
            }
          })
          scene.environment?.dispose()
          pmrem.dispose()
          renderer.dispose()
          renderer.domElement.remove()
        }
        if (disposed) cleanup()
      } catch (err) {
        console.warn('3D scene unavailable, showing photo instead.', err)
        if (!disposed) setFailed(true)
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  if (failed) return <ProductVisual product={product} className="hero__bottle" />
  return <div ref={mount} className="scene3d" role="img" aria-label="Rotating 3D model of Creed Aventus" />
}
