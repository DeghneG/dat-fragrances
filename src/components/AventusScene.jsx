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
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 3.4);
    vec3 col = mix(vec3(0.80, 0.86, 0.84), vec3(1.0, 0.98, 0.95), f);
    gl_FragColor = vec4(col, base + edge * f);
  }`

// Liquid: the flask interior is clipped by a free surface that stays level in the world and sloshes.
const LIQ_COMMON = `
  uniform float uLevel; uniform vec2 uSlope; uniform vec3 uCenter; uniform float uAmp; uniform float uTime;
  varying vec3 vW;
  float surfaceY(vec3 p) {
    vec2 d = p.xz - uCenter.xz;
    float rip = uAmp * (sin(d.x * 7.0 + uTime * 5.0) + sin(d.y * 6.0 - uTime * 4.3) + 0.5 * sin((d.x + d.y) * 11.0 + uTime * 7.0));
    return uLevel + dot(uSlope, d) + rip;
  }`
const LIQ_VS = `
  varying vec3 vN; varying vec3 vV; varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vec4 mv = viewMatrix * w;
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`
const LIQ_FS = `${LIQ_COMMON}
  varying vec3 vN; varying vec3 vV;
  void main() {
    float h = surfaceY(vW) - vW.y;
    if (h < 0.0) discard;
    float meniscus = smoothstep(0.08, 0.0, h);
    if (!gl_FrontFacing) {
      // far inside wall seen through the liquid, and the surface cap
      gl_FragColor = vec4(mix(vec3(0.93, 0.92, 0.76), vec3(1.0), meniscus * 0.7), 0.12 + 0.34 * meniscus);
      return;
    }
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
    gl_FragColor = vec4(mix(vec3(0.9, 0.9, 0.72), vec3(1.0), meniscus * 0.6), 0.06 + 0.2 * f + 0.4 * meniscus);
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
        camera.position.set(0, 2.2, 9.6)
        camera.lookAt(0, 1.95, 0)

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
              idx.push(a, b, a + 1, a + 1, b, b + 1)
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
        const HD = 0.37 // body half depth (the real flask is slim front to back)
        const NECK = 0.28 // neck half width
        const NECKZ = 0.17 // the neck is flat front to back
        const Y_SHOULDER = 2.15 // where the body stops being straight
        const Y_NECK = 3.0 // where the shoulder meets the neck
        const Y_TOP = 3.25 // top of the glass neck
        const BAND0 = 0.14
        const BAND1 = 1.66

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
          if (y < 0.06) k = 0.9 + 0.106 * Math.sqrt(Math.max(0, 1 - Math.pow((0.06 - y) / 0.06, 2))) // rounded bottom edge
          else if (y < 0.17) k = 1.006 // thick foot, a touch wider than the body
          else if (y < 0.22) k = 1.006 - 0.02 * smooth((y - 0.17) / 0.05) // shallow groove under the band
          if (y <= Y_SHOULDER) k *= 1 + 0.014 * Math.sin((Math.PI * y) / Y_SHOULDER) // sides bulge very slightly
          const lip = y > Y_TOP - 0.16 ? 0.055 * smooth((y - (Y_TOP - 0.16)) / 0.16) : 0 // neck flares under the cap
          const hx = (NECK + (HW - NECK) * e) * k - inset + lip
          const hz = (NECKZ + (HD - NECKZ) * Math.pow(e, 0.3)) * k - inset + lip * 0.6 // depth stays full, then tapers late
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
        const glass = mkGlass(0.02, 0.8)
        const glassBase = mkGlass(0.1, 0.85)
        const liqUniforms = {
          uLevel: { value: 2.3 },
          uSlope: { value: new THREE.Vector2(0, 0) },
          uCenter: { value: new THREE.Vector3() },
          uAmp: { value: 0.01 },
          uTime: { value: 0 },
          uAgit: { value: 0 },
        }
        const liquid = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: liqUniforms, vertexShader: LIQ_VS, fragmentShader: LIQ_FS })
        const blackGloss = new THREE.MeshPhysicalMaterial({ color: 0x040404, metalness: 0.2, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.8, flatShading: false })
        const silver = new THREE.MeshStandardMaterial({ color: 0xdcdcd8, metalness: 1, roughness: 0.2, envMapIntensity: 1.8 })

        // brushed-metal band texture (fine horizontal grain)
        const brushedCanvas = document.createElement('canvas')
        brushedCanvas.width = 256
        brushedCanvas.height = 512
        const bg = brushedCanvas.getContext('2d')
        bg.fillStyle = '#0a0a0b'
        bg.fillRect(0, 0, 256, 512)
        const TAU = Math.PI * 2
        for (let k = 0; k < 66; k++) {
          const y0 = k * 7.8 + 3
          const ph = Math.random() * TAU
          const wave = (x) => y0 + 1.6 * Math.sin(x * ((TAU * 4) / 256) + ph) + 0.9 * Math.sin(x * ((TAU * 10) / 256) + ph * 1.7)
          // dark groove
          bg.strokeStyle = 'rgba(0,0,0,0.85)'
          bg.lineWidth = 2.4
          bg.beginPath()
          for (let x = 0; x <= 256; x += 4) (x === 0 ? bg.moveTo(x, wave(x) + 2.2) : bg.lineTo(x, wave(x) + 2.2))
          bg.stroke()
          // thin bright thread
          bg.strokeStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.09})`
          bg.lineWidth = 1.1
          bg.beginPath()
          for (let x = 0; x <= 256; x += 4) (x === 0 ? bg.moveTo(x, wave(x)) : bg.lineTo(x, wave(x)))
          bg.stroke()
        }
        const brushedTex = new THREE.CanvasTexture(brushedCanvas)
        brushedTex.colorSpace = THREE.SRGBColorSpace
        brushedTex.wrapS = THREE.RepeatWrapping
        brushedTex.anisotropy = 8
        const brushed = new THREE.MeshStandardMaterial({ map: brushedTex, bumpMap: brushedTex, bumpScale: 1.2, color: 0x7a7a7a, metalness: 0.25, roughness: 0.5, envMapIntensity: 0.3 })

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
        // the whole interior is built; the shader clips it at the sloshing surface
        const JUICE_BOTTOM = 0.3
        const JUICE_TOP = 3.22
        const juiceRings = ringsFor(JUICE_BOTTOM, JUICE_TOP, 90, 0.1)
        juiceRings.unshift({ ...juiceRings[0], hx: 0.001, hz: 0.001 })
        juiceRings.push({ ...juiceRings[juiceRings.length - 1], hx: 0.001, hz: 0.001 })
        add(sweep(juiceRings), liquid, 1)

        // black brushed band, slightly proud of the glass
        const bandRings = [
          { y: BAND0, hx: HW * 0.985, hz: HD * 0.985, n: 5 },
          { y: BAND0 + 0.02, hx: HW * 1.007, hz: HD * 1.007, n: 5 },
          { y: BAND1 - 0.02, hx: HW * 1.007, hz: HD * 1.007, n: 5 },
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

        const ridge = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.38, depthWrite: false })
        add(sweep([
          { y: 0.108, hx: HW * 1.018, hz: HD * 1.018, n: 5 },
          { y: 0.12, hx: HW * 1.018, hz: HD * 1.018, n: 5 },
        ]), ridge, 4)

        // polished silver ring around the base of the foot
        add(sweep([
          { y: 0.0, hx: HW * 0.9, hz: HD * 0.9, n: 5 },
          { y: 0.015, hx: HW * 1.012, hz: HD * 1.012, n: 5 },
          { y: 0.085, hx: HW * 1.012, hz: HD * 1.012, n: 5 },
          { y: 0.1, hx: HW * 1.004, hz: HD * 1.004, n: 5 },
        ]), silver, 0)

        // collar and faceted cap
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.07, 48), silver)
        collar.position.y = Y_TOP - 0.02
        collar.scale.z = 0.55
        bottle.add(collar)
        const CAP_Y = Y_TOP + 0.01
        const capRings = [
          [0.0, 0.3, 0.17], [0.04, 0.31, 0.18], [0.62, 0.4, 0.24], [0.67, 0.39, 0.23], [0.71, 0.34, 0.2], [0.74, 0.001, 0.001],
        ].map(([y, hx, hz]) => ({ y: CAP_Y + y, hx, hz, n: 3 }))
        add(sweep(capRings, 96), blackGloss, 0)

        // textures
        const makeTex = (w, h, draw) => {
          const c = document.createElement('canvas')
          c.width = w * 2
          c.height = h * 2
          const g2 = c.getContext('2d')
          g2.scale(2, 2)
          draw(g2, w, h)
          const t = new THREE.CanvasTexture(c)
          t.colorSpace = THREE.SRGBColorSpace
          t.anisotropy = 8
          return t
        }
        // silver label with double border
        // label artwork taken from the reference photo (rider on Pegasus + AVENTUS)
        const labelTex = new THREE.TextureLoader().load('/textures/aventus-label.png')
        labelTex.colorSpace = THREE.SRGBColorSpace
        labelTex.anisotropy = 8
        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(1.41, 0.694),
          new THREE.MeshStandardMaterial({ map: labelTex, metalness: 0.5, roughness: 0.3, envMapIntensity: 1 }),
        )
        label.position.set(0, 0.86, HD * 1.007 + 0.004)
        bottle.add(label)

        // CREED logo on the clear glass above the band
        const logoTex = makeTex(1024, 450, (g) => {
          const P = (x, y) => [x - 50, y - 90] // coordinates traced from the zoomed product photo
          const mv = (x, y) => g.moveTo(...P(x, y))
          const ln = (x, y) => g.lineTo(...P(x, y))
          const bc = (a, b, c, d, e, f2) => g.bezierCurveTo(...P(a, b), ...P(c, d), ...P(e, f2))
          g.strokeStyle = '#f2ebdc'
          g.lineCap = 'butt'
          g.lineJoin = 'round'
          g.lineWidth = 25
          g.beginPath() // R
          mv(305, 125); ln(305, 262)
          mv(305, 125); ln(385, 125); bc(450, 125, 450, 215, 385, 215); ln(305, 215)
          mv(375, 215); ln(437, 262)
          g.stroke()
          g.beginPath() // E E
          mv(620, 125); ln(500, 125); ln(500, 262); ln(625, 262); mv(500, 192); ln(600, 192)
          mv(810, 125); ln(690, 125); ln(690, 262); ln(815, 262); mv(690, 192); ln(790, 192)
          g.stroke()
          g.beginPath() // D stem
          mv(880, 122); ln(880, 262)
          g.stroke()
          g.lineWidth = 22
          g.beginPath() // C flowing into the tail that runs to the lower right
          mv(228, 142); bc(190, 118, 140, 118, 120, 165); bc(100, 215, 112, 250, 150, 272); bc(185, 290, 330, 330, 565, 388); ln(985, 492)
          g.stroke()
          g.beginPath() // D flowing into the tail that runs to the lower left
          mv(880, 122); bc(985, 105, 1045, 150, 1036, 210); bc(1030, 262, 960, 282, 880, 298); ln(155, 494)
          g.stroke()
        })
        const logo = new THREE.Mesh(new THREE.PlaneGeometry(1.38, 0.61), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, depthWrite: false, side: THREE.DoubleSide }))
        logo.position.set(0, 1.9, HD + 0.012)
        logo.renderOrder = 4
        bottle.add(logo)

        // the band's top edge rises into a shallow peak under the CREED logo
        const chevShape = new THREE.Shape()
        chevShape.moveTo(-0.58, 0)
        chevShape.lineTo(0, 0.15)
        chevShape.lineTo(0.58, 0)
        chevShape.lineTo(0.58, -0.25)
        chevShape.lineTo(-0.58, -0.25)
        chevShape.closePath()
        const chevMap = brushedTex.clone()
        chevMap.wrapT = THREE.RepeatWrapping
        chevMap.repeat.set(1.4, 0.8)
        chevMap.needsUpdate = true
        const chevMat = brushed.clone()
        chevMat.side = THREE.DoubleSide
        chevMat.map = chevMap
        chevMat.bumpMap = chevMap
        const chev = new THREE.Mesh(new THREE.ShapeGeometry(chevShape), chevMat)
        chev.position.set(0, BAND1 - 0.01, HD * 1.007 + 0.003)
        bottle.add(chev)

        bottle.position.y = 0.02
        const tilt = new THREE.Group()
        tilt.add(bottle)
        scene.add(tilt)

        // drag to spin (and tip) the bottle; it coasts, then resumes its slow turn
        let dragging = false
        let lastX = 0
        let velY = 0
        let pitch = 0
        let idleSince = performance.now()
        const onDown = (e) => {
          dragging = true
          lastX = e.clientX
          velY = 0
          el.classList.add('is-grabbing', 'is-touched')
          el.setPointerCapture?.(e.pointerId)
        }
        const onDrag = (e) => {
          if (!dragging) return
          const dx = e.clientX - lastX
          lastX = e.clientX
          velY = dx * 0.011
          bottle.rotation.y += velY
        }
        const onUp = (e) => {
          if (!dragging) return
          dragging = false
          idleSince = performance.now()
          el.classList.remove('is-grabbing')
          el.releasePointerCapture?.(e.pointerId)
        }
        el.addEventListener('pointerdown', onDown)
        el.addEventListener('pointermove', onDrag)
        el.addEventListener('pointerup', onUp)
        el.addEventListener('pointercancel', onUp)

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
        // slosh physics: the surface tilt is a damped spring, kicked by how hard the bottle is moved
        let sx = 0
        let sz = 0
        let svx = 0
        let svz = 0
        let agit = 0
        let prevYaw = bottle.rotation.y
        let prevPitch = 0
        const wp = new THREE.Vector3()
        const tick = () => {
          const dt = Math.min(clock.getDelta(), 0.05)
          if (!dragging) {
            bottle.rotation.y += velY // coasting after a flick
            velY *= 0.94
            pitch *= 0.96 // tip eases back upright
            const idle = performance.now() - idleSince > 1800
            if (!reduce && idle) bottle.rotation.y += dt * 0.38
          }
          bottle.rotation.x = pitch
          bottle.position.y = 0.02 + (reduce ? 0 : Math.sin(clock.elapsedTime * 0.9) * 0.04)

          if (dt > 0) {
            const omega = Math.max(-14, Math.min(14, (bottle.rotation.y - prevYaw) / dt))
            const pvel = Math.max(-10, Math.min(10, (pitch - prevPitch) / dt))
            prevYaw = bottle.rotation.y
            prevPitch = pitch
            const yaw = bottle.rotation.y
            // sloshes along the bottle's width when it turns, and front-to-back when it tips
            const drive = -omega * 5.2
            const ax = drive * Math.cos(yaw) - 7 * pvel * Math.sin(yaw)
            const az = -drive * Math.sin(yaw) - 7 * pvel * Math.cos(yaw)
            svx += (ax - 24 * sx - 2.4 * svx) * dt
            svz += (az - 24 * sz - 2.4 * svz) * dt
            sx += svx * dt
            sz += svz * dt
            const len = Math.hypot(sx, sz)
            if (len > 0.8) { // the liquid cannot climb past the walls
              sx *= 0.8 / len
              sz *= 0.8 / len
              svx *= 0.5
              svz *= 0.5
            }
            const target = Math.min(1, Math.hypot(sx, sz) * 1.5 + Math.hypot(svx, svz) * 0.12)
            agit += (target - agit) * Math.min(1, dt * 6)
          }
          bottle.getWorldPosition(wp)
          liqUniforms.uCenter.value.copy(wp)
          liqUniforms.uLevel.value = wp.y + 2.3
          liqUniforms.uSlope.value.set(sx, sz)
          liqUniforms.uAmp.value = 0.008 + agit * 0.05
          liqUniforms.uTime.value = clock.elapsedTime
          liqUniforms.uAgit.value = agit
          renderer.render(scene, camera)
          raf = requestAnimationFrame(tick)
        }
        tick()

        cleanup = () => {
          cancelAnimationFrame(raf)
          el.removeEventListener('pointerdown', onDown)
          el.removeEventListener('pointermove', onDrag)
          el.removeEventListener('pointerup', onUp)
          el.removeEventListener('pointercancel', onUp)
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
  return (
    <div ref={mount} className="scene3d" role="img" aria-label="3D model of Creed Aventus. Drag to rotate.">
      <span className="scene3d__hint" aria-hidden="true">Drag to rotate</span>
    </div>
  )
}
