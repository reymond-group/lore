[![view on npm](http://img.shields.io/npm/v/example.svg)](https://www.npmjs.org/package/example)

<a name="Lore"></a>

## Lore
The Lore namespace.

**Kind**: global variable  

* [Lore](#Lore)
    * [.Color](#Lore.Color)
        * [new Lore.Color(r, g, b, a)](#new_Lore.Color_new)
        * _instance_
            * [.set(r, g, b, a)](#Lore.Color+set) ⇒ <code>[Color](#Lore.Color)</code>
        * _static_
            * [.fromHex(hex)](#Lore.Color.fromHex) ⇒ <code>[Color](#Lore.Color)</code>
            * [.hueToRgb(p, q, t)](#Lore.Color.hueToRgb) ⇒ <code>Number</code>
            * [.hslToRgb(h, s, l)](#Lore.Color.hslToRgb) ⇒ <code>Array.&lt;Number&gt;</code>
            * [.rgbToHsl(r, g, b)](#Lore.Color.rgbToHsl) ⇒ <code>Array.&lt;Number&gt;</code>
            * [.gdbHueShift(hue)](#Lore.Color.gdbHueShift) ⇒ <code>Number</code>
    * [.Renderer](#Lore.Renderer)
        * [new Lore.Renderer(targetId, options)](#new_Lore.Renderer_new)
        * [.init()](#Lore.Renderer+init)
        * [.disableContextMenu()](#Lore.Renderer+disableContextMenu)
        * [.setClearColor(color)](#Lore.Renderer+setClearColor)
        * [.getWidth()](#Lore.Renderer+getWidth) ⇒ <code>Number</code>
        * [.getHeight()](#Lore.Renderer+getHeight) ⇒ <code>Number</code>
        * [.updateViewport(x, y, width, height)](#Lore.Renderer+updateViewport)
        * [.animate()](#Lore.Renderer+animate)
        * [.createGeometry(name, shaderName)](#Lore.Renderer+createGeometry) ⇒ <code>[Geometry](#Lore.Geometry)</code>
        * [.setMaxFps(fps)](#Lore.Renderer+setMaxFps)
        * [.getDevicePixelRatio()](#Lore.Renderer+getDevicePixelRatio) ⇒ <code>Number</code>
    * [.Shader](#Lore.Shader)
    * [.Uniform](#Lore.Uniform)
        * [new Lore.Uniform(name, value, type)](#new_Lore.Uniform_new)
        * _instance_
            * [.setValue(value)](#Lore.Uniform+setValue)
        * _static_
            * [.Set(gl, program, uniform)](#Lore.Uniform.Set)
    * [.Node](#Lore.Node)
        * [new Lore.Node()](#new_Lore.Node_new)
        * _instance_
            * [.applyMatrix(matrix)](#Lore.Node+applyMatrix) ⇒ <code>[Node](#Lore.Node)</code>
            * [.getUpVector()](#Lore.Node+getUpVector) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.getForwardVector()](#Lore.Node+getForwardVector) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.getRightVector()](#Lore.Node+getRightVector) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.translateOnAxis(axis, distance)](#Lore.Node+translateOnAxis) ⇒ <code>[Node](#Lore.Node)</code>
            * [.translateX(distance)](#Lore.Node+translateX) ⇒ <code>[Node](#Lore.Node)</code>
            * [.translateY(distance)](#Lore.Node+translateY) ⇒ <code>[Node](#Lore.Node)</code>
            * [.translateZ(distance)](#Lore.Node+translateZ) ⇒ <code>[Node](#Lore.Node)</code>
            * [.setTranslation(v)](#Lore.Node+setTranslation) ⇒ <code>[Node](#Lore.Node)</code>
            * [.setRotation(axis, angle)](#Lore.Node+setRotation) ⇒ <code>[Node](#Lore.Node)</code>
            * [.rotate(axis, angle)](#Lore.Node+rotate) ⇒ <code>[Node](#Lore.Node)</code>
            * [.rotateX(angle)](#Lore.Node+rotateX) ⇒ <code>[Node](#Lore.Node)</code>
            * [.rotateY(angle)](#Lore.Node+rotateY) ⇒ <code>[Node](#Lore.Node)</code>
            * [.rotateZ(angle)](#Lore.Node+rotateZ) ⇒ <code>[Node](#Lore.Node)</code>
            * [.getRotationMatrix()](#Lore.Node+getRotationMatrix) ⇒ <code>[Matrix4f](#Lore.Matrix4f)</code>
            * [.update()](#Lore.Node+update) ⇒ <code>[Node](#Lore.Node)</code>
            * [.getModelMatrix()](#Lore.Node+getModelMatrix) ⇒ <code>Float32Array</code>
        * _static_
            * [.createGUID()](#Lore.Node.createGUID) ⇒ <code>String</code>
    * [.Geometry](#Lore.Geometry)
    * [.Attribute](#Lore.Attribute)
        * [new Lore.Attribute(data, attributeLength, name)](#new_Lore.Attribute_new)
        * [.setFromVector(index, v)](#Lore.Attribute+setFromVector)
        * [.setFromVectorArray(arr)](#Lore.Attribute+setFromVectorArray)
        * [.getX(index)](#Lore.Attribute+getX) ⇒ <code>Number</code>
        * [.setX(index, value)](#Lore.Attribute+setX)
        * [.getY(index)](#Lore.Attribute+getY) ⇒ <code>Number</code>
        * [.setY(index, value)](#Lore.Attribute+setY)
        * [.getZ(index)](#Lore.Attribute+getZ) ⇒ <code>Number</code>
        * [.setZ(index, value)](#Lore.Attribute+setZ)
        * [.getW(index)](#Lore.Attribute+getW) ⇒ <code>Number</code>
        * [.setW(index, value)](#Lore.Attribute+setW)
        * [.getGlType(gl)](#Lore.Attribute+getGlType) ⇒ <code>Number</code>
        * [.update(gl)](#Lore.Attribute+update)
        * [.createBuffer(gl, program, bufferType, drawMode)](#Lore.Attribute+createBuffer)
        * [.bind(gl)](#Lore.Attribute+bind)
    * [.ControlsBase](#Lore.ControlsBase)
        * [new Lore.ControlsBase(renderer, [lookAt], [enableVR])](#new_Lore.ControlsBase_new)
        * [.initWebVR()](#Lore.ControlsBase+initWebVR)
        * [.addEventListener(eventName, callback)](#Lore.ControlsBase+addEventListener)
        * [.removeEventListener(eventName, callback)](#Lore.ControlsBase+removeEventListener)
        * [.raiseEvent(eventName, data)](#Lore.ControlsBase+raiseEvent)
        * [.getLookAt()](#Lore.ControlsBase+getLookAt) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.setLookAt(lookAt)](#Lore.ControlsBase+setLookAt) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.update(e, source)](#Lore.ControlsBase+update) ⇒ <code>[ControlsBase](#Lore.ControlsBase)</code>
    * [.OrbitalControls](#Lore.OrbitalControls)
        * [new Lore.OrbitalControls(renderer, radius, lookAt)](#new_Lore.OrbitalControls_new)
        * [.limitRotationToHorizon(limit)](#Lore.OrbitalControls+limitRotationToHorizon) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.setRadius(radius)](#Lore.OrbitalControls+setRadius) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.update(e, source)](#Lore.OrbitalControls+update) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.setView(phi, theta)](#Lore.OrbitalControls+setView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.zoomIn()](#Lore.OrbitalControls+zoomIn) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.zoomOut()](#Lore.OrbitalControls+zoomOut) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.setZoom(zoom)](#Lore.OrbitalControls+setZoom) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.setTopView()](#Lore.OrbitalControls+setTopView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.setBottomView()](#Lore.OrbitalControls+setBottomView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.setRightView()](#Lore.OrbitalControls+setRightView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.setLeftView()](#Lore.OrbitalControls+setLeftView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.setFrontView()](#Lore.OrbitalControls+setFrontView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.setBackView()](#Lore.OrbitalControls+setBackView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
        * [.setFreeView()](#Lore.OrbitalControls+setFreeView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.FirstPersonControls](#Lore.FirstPersonControls)
        * [new Lore.FirstPersonControls(renderer)](#new_Lore.FirstPersonControls_new)
        * [.update(e, source)](#Lore.FirstPersonControls+update) ⇒ <code>FirstPersonControls</code>
    * [.CameraBase](#Lore.CameraBase)
        * [new Lore.CameraBase()](#new_Lore.CameraBase_new)
        * [.init(gl, program)](#Lore.CameraBase+init) ⇒ <code>CameraBase</code>
        * [.setLookAt(vec)](#Lore.CameraBase+setLookAt) ⇒ <code>CameraBase</code>
        * [.updateViewport(width, height)](#Lore.CameraBase+updateViewport)
        * [.updateProjectionMatrix()](#Lore.CameraBase+updateProjectionMatrix) ⇒ <code>Vector3f</code>
        * [.updateViewMatrix()](#Lore.CameraBase+updateViewMatrix) ⇒ <code>Vector3f</code>
        * [.getProjectionMatrix()](#Lore.CameraBase+getProjectionMatrix) ⇒ <code>Float32Array</code>
        * [.getViewMatrix()](#Lore.CameraBase+getViewMatrix) ⇒ <code>Float32Array</code>
        * [.sceneToScreen(vec, renderer)](#Lore.CameraBase+sceneToScreen) ⇒ <code>Array</code>
    * [.OrthographicCamera](#Lore.OrthographicCamera)
        * [new Lore.OrthographicCamera(left, right, top, bottom, near, far)](#new_Lore.OrthographicCamera_new)
        * [.updateProjectionMatrix()](#Lore.OrthographicCamera+updateProjectionMatrix)
        * [.updateViewport(width, height)](#Lore.OrthographicCamera+updateViewport)
    * [.PerspectiveCamera](#Lore.PerspectiveCamera)
        * [new Lore.PerspectiveCamera(fov, aspect, near, far)](#new_Lore.PerspectiveCamera_new)
        * [.updateProjectionMatrix()](#Lore.PerspectiveCamera+updateProjectionMatrix)
        * [.updateViewport(width, height)](#Lore.PerspectiveCamera+updateViewport)
    * [.Vector3f](#Lore.Vector3f)
        * [new Lore.Vector3f(x, y, z)](#new_Lore.Vector3f_new)
        * _instance_
            * [.set(x, y, z)](#Lore.Vector3f+set) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.getX()](#Lore.Vector3f+getX) ⇒ <code>Number</code>
            * [.getY()](#Lore.Vector3f+getY) ⇒ <code>Number</code>
            * [.getZ()](#Lore.Vector3f+getZ) ⇒ <code>Number</code>
            * [.setX(x)](#Lore.Vector3f+setX) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.setY(y)](#Lore.Vector3f+setY) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.setZ(z)](#Lore.Vector3f+setZ) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.setFromSphericalCoords(s)](#Lore.Vector3f+setFromSphericalCoords) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.copyFrom(v)](#Lore.Vector3f+copyFrom) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.setLength(length)](#Lore.Vector3f+setLength) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.lengthSq()](#Lore.Vector3f+lengthSq) ⇒ <code>Number</code>
            * [.length()](#Lore.Vector3f+length) ⇒ <code>Number</code>
            * [.normalize()](#Lore.Vector3f+normalize) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.multiply(v)](#Lore.Vector3f+multiply) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.multiplyScalar(s)](#Lore.Vector3f+multiplyScalar) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.divide(v)](#Lore.Vector3f+divide) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.divideScalar(s)](#Lore.Vector3f+divideScalar) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.add(v)](#Lore.Vector3f+add) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.subtract(v)](#Lore.Vector3f+subtract) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.dot(v)](#Lore.Vector3f+dot) ⇒ <code>Number</code>
            * [.cross(v)](#Lore.Vector3f+cross) ⇒ <code>Number</code>
            * [.project(camera)](#Lore.Vector3f+project) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.unproject(camera)](#Lore.Vector3f+unproject) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.applyProjection(m)](#Lore.Vector3f+applyProjection) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.toDirection(m)](#Lore.Vector3f+toDirection) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.applyQuaternion(q)](#Lore.Vector3f+applyQuaternion) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.distanceToSq(v)](#Lore.Vector3f+distanceToSq) ⇒ <code>Number</code>
            * [.distanceTo(v)](#Lore.Vector3f+distanceTo) ⇒ <code>Number</code>
            * [.clone()](#Lore.Vector3f+clone) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.equals(v)](#Lore.Vector3f+equals) ⇒ <code>Boolean</code>
            * [.toString()](#Lore.Vector3f+toString) ⇒ <code>String</code>
        * _static_
            * [.normalize(v)](#Lore.Vector3f.normalize) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.multiply(u, v)](#Lore.Vector3f.multiply) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.multiplyScalar(v, s)](#Lore.Vector3f.multiplyScalar) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.divide(u, v)](#Lore.Vector3f.divide) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.divideScalar(v, s)](#Lore.Vector3f.divideScalar) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.add(u, v)](#Lore.Vector3f.add) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.subtract(u, v)](#Lore.Vector3f.subtract) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.cross(u, v)](#Lore.Vector3f.cross) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.dot(u, v)](#Lore.Vector3f.dot) ⇒ <code>Number</code>
            * [.forward()](#Lore.Vector3f.forward) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.up()](#Lore.Vector3f.up) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.right()](#Lore.Vector3f.right) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
    * [.Matrix3f](#Lore.Matrix3f)
        * [new Lore.Matrix3f([entries])](#new_Lore.Matrix3f_new)
        * [.clone()](#Lore.Matrix3f+clone) ⇒ <code>Matrix3f</code>
        * [.equals(mat)](#Lore.Matrix3f+equals) ⇒ <code>boolean</code>
    * [.Matrix4f](#Lore.Matrix4f)
        * [new Lore.Matrix4f([entries])](#new_Lore.Matrix4f_new)
        * _instance_
            * [.set(m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33)](#Lore.Matrix4f+set) ⇒ <code>Matrix4f</code>
            * [.multiplyA(b)](#Lore.Matrix4f+multiplyA) ⇒ <code>Matrix4f</code>
            * [.multiplyB(a)](#Lore.Matrix4f+multiplyB) ⇒ <code>Matrix4f</code>
            * [.scale(v)](#Lore.Matrix4f+scale) ⇒ <code>Matrix4f</code>
            * [.setPosition(vec)](#Lore.Matrix4f+setPosition) ⇒ <code>Matrix4f</code>
            * [.setRotation(q)](#Lore.Matrix4f+setRotation) ⇒ <code>Matrix4f</code>
            * [.determinant()](#Lore.Matrix4f+determinant) ⇒ <code>Number</code>
            * [.decompose(outPosition, outQuaternion, outScale)](#Lore.Matrix4f+decompose) ⇒ <code>Matrix4f</code>
            * [.compose(position, quaternion, scale)](#Lore.Matrix4f+compose) ⇒ <code>Matrix4f</code>
            * [.invert()](#Lore.Matrix4f+invert) ⇒ <code>Matrix4f</code>
            * [.clone()](#Lore.Matrix4f+clone) ⇒ <code>Matrix4f</code>
            * [.equals(a)](#Lore.Matrix4f+equals) ⇒ <code>Boolean</code>
            * [.toString()](#Lore.Matrix4f+toString) ⇒ <code>String</code>
        * _static_
            * [.multiply(a, b)](#Lore.Matrix4f.multiply) ⇒ <code>Matrix4f</code>
            * [.fromQuaternion(q)](#Lore.Matrix4f.fromQuaternion) ⇒ <code>Matrix4f</code>
            * [.lookAt(cameraPosition, target, up)](#Lore.Matrix4f.lookAt) ⇒ <code>Matrix4f</code>
            * [.compose(position, quaternion, scale)](#Lore.Matrix4f.compose) ⇒ <code>Matrix4f</code>
            * [.invert(matrix)](#Lore.Matrix4f.invert) ⇒
    * [.Quaternion](#Lore.Quaternion)
        * [new Lore.Quaternion(x, y, z, w)](#new_Lore.Quaternion_new)
        * _instance_
            * [.getX()](#Lore.Quaternion+getX) ⇒ <code>Number</code>
            * [.getY()](#Lore.Quaternion+getY) ⇒ <code>Number</code>
            * [.getZ()](#Lore.Quaternion+getZ) ⇒ <code>Number</code>
            * [.getW()](#Lore.Quaternion+getW) ⇒ <code>Number</code>
            * [.set(x, y, z, w)](#Lore.Quaternion+set) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.setX(x)](#Lore.Quaternion+setX) ⇒ <code>Quaternion</code>
            * [.setY(y)](#Lore.Quaternion+setY) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.setZ(z)](#Lore.Quaternion+setZ) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.setW(w)](#Lore.Quaternion+setW) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.setFromAxisAngle(axis, angle)](#Lore.Quaternion+setFromAxisAngle) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.setFromUnitVectors(from, to)](#Lore.Quaternion+setFromUnitVectors) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.lookAt(source, dest, up)](#Lore.Quaternion+lookAt) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.lengthSq()](#Lore.Quaternion+lengthSq) ⇒ <code>Number</code>
            * [.length()](#Lore.Quaternion+length) ⇒ <code>Number</code>
            * [.inverse()](#Lore.Quaternion+inverse) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.normalize()](#Lore.Quaternion+normalize) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.dot(q)](#Lore.Quaternion+dot) ⇒ <code>Number</code>
            * [.multiplyA(b)](#Lore.Quaternion+multiplyA) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.multiplyB(a)](#Lore.Quaternion+multiplyB) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.multiplyScalar(s)](#Lore.Quaternion+multiplyScalar) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.conjugate()](#Lore.Quaternion+conjugate) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.add(q)](#Lore.Quaternion+add) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.subtract(q)](#Lore.Quaternion+subtract) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.rotateX(angle)](#Lore.Quaternion+rotateX) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.rotateY(angle)](#Lore.Quaternion+rotateY) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.rotateZ(angle)](#Lore.Quaternion+rotateZ) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.toRotationMatrix()](#Lore.Quaternion+toRotationMatrix) ⇒ <code>[Matrix4f](#Lore.Matrix4f)</code>
            * [.setFromMatrix(m)](#Lore.Quaternion+setFromMatrix) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.clone()](#Lore.Quaternion+clone) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.equals(q)](#Lore.Quaternion+equals) ⇒ <code>Boolean</code>
            * [.toString()](#Lore.Quaternion+toString) ⇒ <code>String</code>
        * _static_
            * [.dot(q, p)](#Lore.Quaternion.dot) ⇒ <code>Number</code>
            * [.multiply(a, b)](#Lore.Quaternion.multiply) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.multiplyScalar(q, s)](#Lore.Quaternion.multiplyScalar) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.inverse(q)](#Lore.Quaternion.inverse) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.normalize(q)](#Lore.Quaternion.normalize) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.conjugate(q)](#Lore.Quaternion.conjugate) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.add(q, p)](#Lore.Quaternion.add) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.subtract(q, p)](#Lore.Quaternion.subtract) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.fromMatrix(m)](#Lore.Quaternion.fromMatrix) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
            * [.slerp(q, p, t)](#Lore.Quaternion.slerp) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
    * [.SphericalCoords](#Lore.SphericalCoords)
        * [new Lore.SphericalCoords(radius, phi, theta)](#new_Lore.SphericalCoords_new)
        * [.set(radius, phi, theta)](#Lore.SphericalCoords+set) ⇒ <code>SphericalCoords</code>
        * [.secure()](#Lore.SphericalCoords+secure) ⇒ <code>SphericalCoords</code>
        * [.setFromVector(v)](#Lore.SphericalCoords+setFromVector) ⇒ <code>SphericalCoords</code>
        * [.limit(phiMin, phiMax, thetaMin, thetaMax)](#Lore.SphericalCoords+limit) ⇒ <code>SphericalCoords</code>
        * [.clone()](#Lore.SphericalCoords+clone) ⇒ <code>SphericalCoords</code>
        * [.toString()](#Lore.SphericalCoords+toString) ⇒ <code>String</code>
    * [.ProjectionMatrix](#Lore.ProjectionMatrix)
        * [.setOrthographic(left, right, top, bottom, near, far)](#Lore.ProjectionMatrix+setOrthographic) ⇒ <code>ProjectionMatrix</code>
        * [.setPerspective(fov, aspect, near, far)](#Lore.ProjectionMatrix+setPerspective) ⇒ <code>ProjectionMatrix</code>
    * [.Statistics](#Lore.Statistics)
        * [.randomNormal()](#Lore.Statistics.randomNormal) ⇒ <code>Number</code>
        * [.randomNormalInRange(a, b)](#Lore.Statistics.randomNormalInRange) ⇒ <code>Number</code>
        * [.randomNormalScaled(mean, sd)](#Lore.Statistics.randomNormalScaled) ⇒ <code>Number</code>
        * [.normalize(arr)](#Lore.Statistics.normalize) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.scale(value, oldMin, oldMax, newMin, newMax)](#Lore.Statistics.scale) ⇒ <code>Number</code>
    * [.Ray](#Lore.Ray)
        * [new Lore.Ray(source, direction)](#new_Lore.Ray_new)
        * [.copyFrom(r)](#Lore.Ray+copyFrom) ⇒ <code>Ray</code>
        * [.applyProjection(m)](#Lore.Ray+applyProjection) ⇒ <code>Ray</code>
        * [.distanceSqToPoint(v)](#Lore.Ray+distanceSqToPoint) ⇒ <code>Number</code>
        * [.closestPointToPoint(v)](#Lore.Ray+closestPointToPoint) ⇒ <code>Vector3f</code>
    * [.RadixSort](#Lore.RadixSort)
        * [new Lore.RadixSort()](#new_Lore.RadixSort_new)
        * [.sort(arr, [copyArray])](#Lore.RadixSort+sort) ⇒ <code>Object</code>
        * [.lsbPass(arr, aux)](#Lore.RadixSort+lsbPass)
        * [.pass(arr, aux)](#Lore.RadixSort+pass)
        * [.msbPass(arr, aux)](#Lore.RadixSort+msbPass)
        * [.initHistograms(arr, maxOffset, lastMask)](#Lore.RadixSort+initHistograms)
    * [.HelperBase](#Lore.HelperBase)
        * [new Lore.HelperBase(renderer, geometryName, shaderName)](#new_Lore.HelperBase_new)
        * [.setAttribute(name, data)](#Lore.HelperBase+setAttribute)
        * [.getAttribute(name)](#Lore.HelperBase+getAttribute) ⇒ <code>TypedArray</code>
        * [.updateAttribute(name, index, value)](#Lore.HelperBase+updateAttribute)
        * [.updateAttributeAll(name, values)](#Lore.HelperBase+updateAttributeAll)
        * [.draw()](#Lore.HelperBase+draw)
        * [.destruct()](#Lore.HelperBase+destruct)
    * [.PointHelper](#Lore.PointHelper)
        * [new Lore.PointHelper(renderer, geometryName, shaderName, options)](#new_Lore.PointHelper_new)
        * [.getMaxLength(x, y, z)](#Lore.PointHelper+getMaxLength) ⇒ <code>Number</code>
        * [.getDimensions()](#Lore.PointHelper+getDimensions) ⇒ <code>Object</code>
        * [.getCenter()](#Lore.PointHelper+getCenter) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.setPositions(positions)](#Lore.PointHelper+setPositions) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.setPositionsXYZ(x, y, z, length)](#Lore.PointHelper+setPositionsXYZ) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.setPositionsXYZHSS(x, y, z, hue, saturation, size)](#Lore.PointHelper+setPositionsXYZHSS) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.setRGB(r, g, b)](#Lore.PointHelper+setRGB) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.setColors(colors)](#Lore.PointHelper+setColors) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.updateColors(colors)](#Lore.PointHelper+updateColors) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.updateColor(index, color)](#Lore.PointHelper+updateColor) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.setPointSize(size)](#Lore.PointHelper+setPointSize) ⇒ <code>Number</code>
        * [.updatePointSize()](#Lore.PointHelper+updatePointSize)
        * [.getPointSize()](#Lore.PointHelper+getPointSize) ⇒ <code>Number</code>
        * [.getPointScale()](#Lore.PointHelper+getPointScale) ⇒ <code>Number</code>
        * [.setPointScale(pointScale)](#Lore.PointHelper+setPointScale) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.setFogDistance(fogStart, fogEnd)](#Lore.PointHelper+setFogDistance) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.initPointSize()](#Lore.PointHelper+initPointSize) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.getCutoff()](#Lore.PointHelper+getCutoff) ⇒ <code>Number</code>
        * [.setCutoff(cutoff)](#Lore.PointHelper+setCutoff) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.getHue(index)](#Lore.PointHelper+getHue) ⇒ <code>Number</code>
        * [.getSaturation(index)](#Lore.PointHelper+getSaturation) ⇒ <code>Number</code>
        * [.getSize(index)](#Lore.PointHelper+getSize) ⇒ <code>Number</code>
        * [.getPosition(index)](#Lore.PointHelper+getPosition) ⇒ <code>Number</code>
        * [.setHue(hue)](#Lore.PointHelper+setHue)
        * [.setSaturation(hue)](#Lore.PointHelper+setSaturation)
        * [.setSize(hue)](#Lore.PointHelper+setSize)
        * [.setHSS(hue, saturation, size, length)](#Lore.PointHelper+setHSS)
        * [.setHSSFromArrays(hue, saturation, size, length)](#Lore.PointHelper+setHSSFromArrays)
        * [.addFilter(name, filter)](#Lore.PointHelper+addFilter) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.removeFilter(name)](#Lore.PointHelper+removeFilter) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
        * [.getFilter(name)](#Lore.PointHelper+getFilter) ⇒ <code>[FilterBase](#Lore.FilterBase)</code>
    * [.CoordinatesHelper](#Lore.CoordinatesHelper)
        * [new Lore.CoordinatesHelper(renderer, geometryName, shaderName, options)](#new_Lore.CoordinatesHelper_new)
        * [.init()](#Lore.CoordinatesHelper+init)
    * [.OctreeHelper](#Lore.OctreeHelper)
        * [new Lore.OctreeHelper(renderer, geometryName, shaderName, target, options)](#new_Lore.OctreeHelper_new)
        * [.init()](#Lore.OctreeHelper+init)
        * [.setPointSizeFromZoom(zoom)](#Lore.OctreeHelper+setPointSizeFromZoom)
        * [.getScreenPosition(index)](#Lore.OctreeHelper+getScreenPosition) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.addSelected(item)](#Lore.OctreeHelper+addSelected)
        * [.removeSelected(index)](#Lore.OctreeHelper+removeSelected)
        * [.clearSelected()](#Lore.OctreeHelper+clearSelected)
        * [.selectedContains(index)](#Lore.OctreeHelper+selectedContains) ⇒ <code>Boolean</code>
        * [.setHovered(index)](#Lore.OctreeHelper+setHovered)
        * [.selectHovered()](#Lore.OctreeHelper+selectHovered)
        * [.showCenters()](#Lore.OctreeHelper+showCenters)
        * [.showCubes()](#Lore.OctreeHelper+showCubes)
        * [.hide()](#Lore.OctreeHelper+hide)
        * [.getIntersections(mouse)](#Lore.OctreeHelper+getIntersections) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.addEventListener(eventName, callback)](#Lore.OctreeHelper+addEventListener)
        * [.raiseEvent(eventName, data)](#Lore.OctreeHelper+raiseEvent)
        * [.drawCenters()](#Lore.OctreeHelper+drawCenters)
        * [.drawBoxes()](#Lore.OctreeHelper+drawBoxes)
        * [.setThreshold(threshold)](#Lore.OctreeHelper+setThreshold)
        * [.rayIntersections(indices)](#Lore.OctreeHelper+rayIntersections) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.destruct()](#Lore.OctreeHelper+destruct)
    * [.FilterBase](#Lore.FilterBase)
        * [new Lore.FilterBase(attribute, attributeIndex)](#new_Lore.FilterBase_new)
        * _instance_
            * [.getGeometry()](#Lore.FilterBase+getGeometry) ⇒ <code>[Geometry](#Lore.Geometry)</code>
            * [.setGeometry(value)](#Lore.FilterBase+setGeometry)
            * [.filter()](#Lore.FilterBase+filter)
            * [.reset()](#Lore.FilterBase+reset)
        * _static_
            * [.isVisible(geometry, index)](#Lore.FilterBase.isVisible) ⇒ <code>boolean</code>
    * [.InRangeFilter](#Lore.InRangeFilter)
        * [new Lore.InRangeFilter(attribute, attributeIndex, min, max)](#new_Lore.InRangeFilter_new)
        * [.getMin()](#Lore.InRangeFilter+getMin) ⇒ <code>number</code>
        * [.setMin(value)](#Lore.InRangeFilter+setMin)
        * [.getMax()](#Lore.InRangeFilter+getMax) ⇒ <code>number</code>
        * [.setMax(value)](#Lore.InRangeFilter+setMax)
        * [.filter()](#Lore.InRangeFilter+filter)
        * [.reset()](#Lore.InRangeFilter+reset)
    * [.FileReaderBase](#Lore.FileReaderBase)
        * [new Lore.FileReaderBase(source, [local])](#new_Lore.FileReaderBase_new)
        * [.addEventListener(eventName, callback)](#Lore.FileReaderBase+addEventListener)
        * [.raiseEvent(eventName, data)](#Lore.FileReaderBase+raiseEvent)
        * [.loaded(data)](#Lore.FileReaderBase+loaded)
    * [.CsvFileReader](#Lore.CsvFileReader)
        * [new Lore.CsvFileReader(source, options, [local])](#new_Lore.CsvFileReader_new)
        * [.loaded(data)](#Lore.CsvFileReader+loaded) ⇒ <code>[CsvFileReader](#Lore.CsvFileReader)</code>
    * [.MatrixFileReader](#Lore.MatrixFileReader)
        * [new Lore.MatrixFileReader(source, options, [local])](#new_Lore.MatrixFileReader_new)
        * [.loaded(data)](#Lore.MatrixFileReader+loaded) ⇒ <code>[MatrixFileReader](#Lore.MatrixFileReader)</code>
    * [.Utils](#Lore.Utils)
        * [.extend()](#Lore.Utils.extend) ⇒ <code>object</code>
        * [.arrayContains(array, value)](#Lore.Utils.arrayContains) ⇒ <code>boolean</code>
        * [.concatTypedArrays(arrA, arrB)](#Lore.Utils.concatTypedArrays) ⇒ <code>TypedArray</code>
        * [.msb(n)](#Lore.Utils.msb) ⇒ <code>Number</code>
        * [.mergePointDistances(a, b)](#Lore.Utils.mergePointDistances) ⇒ <code>object</code>
        * [.isInt(n)](#Lore.Utils.isInt) ⇒
        * [.isFloat(n)](#Lore.Utils.isFloat) ⇒
        * [.jsonp(url, callback)](#Lore.Utils.jsonp)
    * [.Octree](#Lore.Octree)
        * [new Lore.Octree(threshold, maxDepth)](#new_Lore.Octree_new)
        * _instance_
            * [.build(pointIndices, vertices, aabb, locCode)](#Lore.Octree+build)
            * [.getLocCodes()](#Lore.Octree+getLocCodes)
            * [.getDepth(locCode)](#Lore.Octree+getDepth) ⇒ <code>number</code>
            * [.generateLocCode(The, The)](#Lore.Octree+generateLocCode) ⇒ <code>number</code>
            * [.traverse(traverseCallback, locCode)](#Lore.Octree+traverse)
            * [.traverseIf(traverseIfCallback, conditionCallback, locCode)](#Lore.Octree+traverseIf)
            * [.raySearch(raycaster)](#Lore.Octree+raySearch) ⇒ <code>Array</code>
            * [.getCenters()](#Lore.Octree+getCenters) ⇒ <code>Array</code>
            * [.getClosestBox(point, threshold, locCode)](#Lore.Octree+getClosestBox) ⇒ <code>[AABB](#Lore.AABB)</code>
            * [.getClosestBoxFromCenter(point, threshold, locCode)](#Lore.Octree+getClosestBoxFromCenter) ⇒ <code>[AABB](#Lore.AABB)</code>
            * [.getFarthestBox(point, threshold, locCode)](#Lore.Octree+getFarthestBox) ⇒ <code>[AABB](#Lore.AABB)</code>
            * [.getClosestPoint(point, positions, threshold, locCode)](#Lore.Octree+getClosestPoint) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.getFarthestPoint(point, positions, threshold, locCode)](#Lore.Octree+getFarthestPoint) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
            * [.getParent(locCode)](#Lore.Octree+getParent)
            * [.getNeighbours(locCode)](#Lore.Octree+getNeighbours) ⇒ <code>Array</code>
            * [.kNearestNeighbours(k, point, locCode, positions, kNNCallback)](#Lore.Octree+kNearestNeighbours)
            * [.getCellDistancesToPoint(x, y, z, locCode)](#Lore.Octree+getCellDistancesToPoint) ⇒ <code>Object</code>
            * [.expandNeighbourhood(x, y, z, locCode, cellDistances)](#Lore.Octree+expandNeighbourhood) ⇒ <code>number</code>
            * [.cellDistancesSq(x, y, z, locCode)](#Lore.Octree+cellDistancesSq) ⇒ <code>Object</code>
            * [.pointDistancesSq(x, y, z, locCode, positions)](#Lore.Octree+pointDistancesSq) ⇒ <code>Object</code>
        * _static_
            * [.concatTypedArrays(a, b)](#Lore.Octree.concatTypedArrays) ⇒ <code>Array</code>
            * [.mergePointDistances(a, b)](#Lore.Octree.mergePointDistances) ⇒ <code>Object</code>
            * [.mergeCellDistances(a, b)](#Lore.Octree.mergeCellDistances) ⇒ <code>Object</code>
            * [.clone(original)](#Lore.Octree.clone) ⇒ <code>[Octree](#Lore.Octree)</code>
    * [.AABB](#Lore.AABB)
        * [new Lore.AABB(center, radius)](#new_Lore.AABB_new)
        * _instance_
            * [.updateDimensions()](#Lore.AABB+updateDimensions)
            * [.setLocCode(locCode)](#Lore.AABB+setLocCode)
            * [.getLocCode()](#Lore.AABB+getLocCode) ⇒ <code>number</code>
            * [.rayTest(source, dir, dist)](#Lore.AABB+rayTest) ⇒ <code>boolean</code>
            * [.cylinderTest(source, dir, dist, radius)](#Lore.AABB+cylinderTest) ⇒ <code>boolean</code>
            * [.distanceToPointSq(x, y, z)](#Lore.AABB+distanceToPointSq) ⇒ <code>number</code>
            * [.distanceFromCenterToPointSq(x, y, z)](#Lore.AABB+distanceFromCenterToPointSq) ⇒ <code>number</code>
            * [.testAABB(aabb)](#Lore.AABB+testAABB) ⇒ <code>boolean</code>
        * _static_
            * [.fromPoints(vertices)](#Lore.AABB.fromPoints) ⇒ <code>[AABB](#Lore.AABB)</code>
            * [.getCorners(aabb)](#Lore.AABB.getCorners) ⇒ <code>Array</code>
            * [.clone(original)](#Lore.AABB.clone) ⇒ <code>[AABB](#Lore.AABB)</code>
    * [.Raycaster](#Lore.Raycaster)
        * [.set(camera, mouseX, mouseY)](#Lore.Raycaster+set) ⇒ <code>[Raycaster](#Lore.Raycaster)</code>
    * [.DrawModes](#Lore.DrawModes)

<a name="Lore.Color"></a>

### Lore.Color
A class representing a Color.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| components | <code>Float32Array</code> | A typed array storing the components of this color (rgba). |


* [.Color](#Lore.Color)
    * [new Lore.Color(r, g, b, a)](#new_Lore.Color_new)
    * _instance_
        * [.set(r, g, b, a)](#Lore.Color+set) ⇒ <code>[Color](#Lore.Color)</code>
    * _static_
        * [.fromHex(hex)](#Lore.Color.fromHex) ⇒ <code>[Color](#Lore.Color)</code>
        * [.hueToRgb(p, q, t)](#Lore.Color.hueToRgb) ⇒ <code>Number</code>
        * [.hslToRgb(h, s, l)](#Lore.Color.hslToRgb) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.rgbToHsl(r, g, b)](#Lore.Color.rgbToHsl) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.gdbHueShift(hue)](#Lore.Color.gdbHueShift) ⇒ <code>Number</code>

<a name="new_Lore.Color_new"></a>

#### new Lore.Color(r, g, b, a)
Creates an instance of Color.


| Param | Type | Description |
| --- | --- | --- |
| r | <code>Number</code> | The red component (0.0 - 1.0). |
| g | <code>Number</code> | The green component (0.0 - 1.0). |
| b | <code>Number</code> | The blue component (0.0 - 1.0). |
| a | <code>Number</code> | The alpha component (0.0 - 1.0). |

<a name="Lore.Color+set"></a>

#### color.set(r, g, b, a) ⇒ <code>[Color](#Lore.Color)</code>
Set the red, green, blue and alpha components of the color.

**Kind**: instance method of <code>[Color](#Lore.Color)</code>  
**Returns**: <code>[Color](#Lore.Color)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>Number</code> | The red component (0.0 - 1.0). |
| g | <code>Number</code> | The green component (0.0 - 1.0). |
| b | <code>Number</code> | The blue component (0.0 - 1.0). |
| a | <code>Number</code> | The alpha component (0.0 - 1.0). |

<a name="Lore.Color.fromHex"></a>

#### Color.fromHex(hex) ⇒ <code>[Color](#Lore.Color)</code>
Set the r,g,b,a components from a hex string.

**Kind**: static method of <code>[Color](#Lore.Color)</code>  
**Returns**: <code>[Color](#Lore.Color)</code> - A color representing the hex string.  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>String</code> | A hex string in the form of #ABCDEF or #ABC. |

<a name="Lore.Color.hueToRgb"></a>

#### Color.hueToRgb(p, q, t) ⇒ <code>Number</code>
Get the r, g or b value from a hue component.

**Kind**: static method of <code>[Color](#Lore.Color)</code>  
**Returns**: <code>Number</code> - The r, g or b component value.  

| Param | Type |
| --- | --- |
| p | <code>Number</code> | 
| q | <code>Number</code> | 
| t | <code>Number</code> | 

<a name="Lore.Color.hslToRgb"></a>

#### Color.hslToRgb(h, s, l) ⇒ <code>Array.&lt;Number&gt;</code>
Converts HSL to RGB.

**Kind**: static method of <code>[Color](#Lore.Color)</code>  
**Returns**: <code>Array.&lt;Number&gt;</code> - An array containing the r, g and b values ([r, g, b]).  

| Param | Type | Description |
| --- | --- | --- |
| h | <code>Number</code> | The hue component. |
| s | <code>Number</code> | The saturation component. |
| l | <code>Number</code> | The lightness component. |

<a name="Lore.Color.rgbToHsl"></a>

#### Color.rgbToHsl(r, g, b) ⇒ <code>Array.&lt;Number&gt;</code>
Converts RGB to HSL.

**Kind**: static method of <code>[Color](#Lore.Color)</code>  
**Returns**: <code>Array.&lt;Number&gt;</code> - An array containing the h, s and l values ([h, s, l]).  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>Number</code> | The red component. |
| g | <code>Number</code> | The green component. |
| b | <code>Number</code> | The blue component. |

<a name="Lore.Color.gdbHueShift"></a>

#### Color.gdbHueShift(hue) ⇒ <code>Number</code>
Shifts the hue so that 0.0 represents blue and 1.0 represents magenta.

**Kind**: static method of <code>[Color](#Lore.Color)</code>  
**Returns**: <code>Number</code> - The hue component shifted so that 0.0 is blue and 1.0 is magenta.  

| Param | Type | Description |
| --- | --- | --- |
| hue | <code>Number</code> | A hue component. |

<a name="Lore.Renderer"></a>

### Lore.Renderer
A class representing the WebGL renderer.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | An object containing options. |
| camera | <code>[CameraBase](#Lore.CameraBase)</code> | The camera associated with this renderer. |
| controls | <code>[ControlsBase](#Lore.ControlsBase)</code> | The controls associated with this renderer. |


* [.Renderer](#Lore.Renderer)
    * [new Lore.Renderer(targetId, options)](#new_Lore.Renderer_new)
    * [.init()](#Lore.Renderer+init)
    * [.disableContextMenu()](#Lore.Renderer+disableContextMenu)
    * [.setClearColor(color)](#Lore.Renderer+setClearColor)
    * [.getWidth()](#Lore.Renderer+getWidth) ⇒ <code>Number</code>
    * [.getHeight()](#Lore.Renderer+getHeight) ⇒ <code>Number</code>
    * [.updateViewport(x, y, width, height)](#Lore.Renderer+updateViewport)
    * [.animate()](#Lore.Renderer+animate)
    * [.createGeometry(name, shaderName)](#Lore.Renderer+createGeometry) ⇒ <code>[Geometry](#Lore.Geometry)</code>
    * [.setMaxFps(fps)](#Lore.Renderer+setMaxFps)
    * [.getDevicePixelRatio()](#Lore.Renderer+getDevicePixelRatio) ⇒ <code>Number</code>

<a name="new_Lore.Renderer_new"></a>

#### new Lore.Renderer(targetId, options)
Creates an instance of Renderer.


| Param | Type | Description |
| --- | --- | --- |
| targetId | <code>String</code> | The id of a canvas element. |
| options | <code>any</code> | The options. |

<a name="Lore.Renderer+init"></a>

#### renderer.init()
Initialize and start the renderer.

**Kind**: instance method of <code>[Renderer](#Lore.Renderer)</code>  
<a name="Lore.Renderer+disableContextMenu"></a>

#### renderer.disableContextMenu()
Disables the context menu on the canvas element.

**Kind**: instance method of <code>[Renderer](#Lore.Renderer)</code>  
<a name="Lore.Renderer+setClearColor"></a>

#### renderer.setClearColor(color)
Sets the clear color of this renderer.

**Kind**: instance method of <code>[Renderer](#Lore.Renderer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>[Color](#Lore.Color)</code> | The clear color. |

<a name="Lore.Renderer+getWidth"></a>

#### renderer.getWidth() ⇒ <code>Number</code>
Get the actual width of the canvas.

**Kind**: instance method of <code>[Renderer](#Lore.Renderer)</code>  
**Returns**: <code>Number</code> - The width of the canvas.  
<a name="Lore.Renderer+getHeight"></a>

#### renderer.getHeight() ⇒ <code>Number</code>
Get the actual height of the canvas.

**Kind**: instance method of <code>[Renderer](#Lore.Renderer)</code>  
**Returns**: <code>Number</code> - The height of the canvas.  
<a name="Lore.Renderer+updateViewport"></a>

#### renderer.updateViewport(x, y, width, height)
Update the viewport. Should be called when the canvas is resized.

**Kind**: instance method of <code>[Renderer](#Lore.Renderer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The horizontal offset of the viewport. |
| y | <code>Number</code> | The vertical offset of the viewport. |
| width | <code>Number</code> | The width of the viewport. |
| height | <code>Number</code> | The height of the viewport. |

<a name="Lore.Renderer+animate"></a>

#### renderer.animate()
The main rendering loop.

**Kind**: instance method of <code>[Renderer](#Lore.Renderer)</code>  
<a name="Lore.Renderer+createGeometry"></a>

#### renderer.createGeometry(name, shaderName) ⇒ <code>[Geometry](#Lore.Geometry)</code>
Creates and adds a geometry to the scene graph.

**Kind**: instance method of <code>[Renderer](#Lore.Renderer)</code>  
**Returns**: <code>[Geometry](#Lore.Geometry)</code> - The created geometry.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the geometry. |
| shaderName | <code>String</code> | The name of the shader used to render the geometry. |

<a name="Lore.Renderer+setMaxFps"></a>

#### renderer.setMaxFps(fps)
Set the maximum frames per second of this renderer.

**Kind**: instance method of <code>[Renderer](#Lore.Renderer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fps | <code>Number</code> | Maximum frames per second. |

<a name="Lore.Renderer+getDevicePixelRatio"></a>

#### renderer.getDevicePixelRatio() ⇒ <code>Number</code>
Get the device pixel ratio.

**Kind**: instance method of <code>[Renderer](#Lore.Renderer)</code>  
**Returns**: <code>Number</code> - The device pixel ratio.  
<a name="Lore.Shader"></a>

### Lore.Shader
A class representing a shader.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the shader. |
| uniforms | <code>Object</code> | A map mapping uniform names to Lore.Uniform instances. |

<a name="Lore.Uniform"></a>

### Lore.Uniform
A class representing a uniform.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of this uniform. Also the variable name in the shader. |
| value | <code>Number</code> | The value of this uniform. |
| type | <code>String</code> | The type of this uniform. Available types: int, int_vec2, int_vec3, int_vec4, int_array, float, float_vec2, float_vec3, float_vec4, float_array, float_mat2, float_mat3, float_mat4. |
| stale | <code>Boolean</code> | A boolean indicating whether or not this uniform is stale and needs to be updated. |


* [.Uniform](#Lore.Uniform)
    * [new Lore.Uniform(name, value, type)](#new_Lore.Uniform_new)
    * _instance_
        * [.setValue(value)](#Lore.Uniform+setValue)
    * _static_
        * [.Set(gl, program, uniform)](#Lore.Uniform.Set)

<a name="new_Lore.Uniform_new"></a>

#### new Lore.Uniform(name, value, type)
Creates an instance of Uniform.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of this uniform. Also the variable name in the shader. |
| value | <code>Number</code> | The value of this uniform. |
| type | <code>String</code> | The type of this uniform. Available types: int, int_vec2, int_vec3, int_vec4, int_array, float, float_vec2, float_vec3, float_vec4, float_array, float_mat2, float_mat3, float_mat4. |

<a name="Lore.Uniform+setValue"></a>

#### uniform.setValue(value)
Set the value of this uniform.

**Kind**: instance method of <code>[Uniform](#Lore.Uniform)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | A number which is valid for the specified type. |

<a name="Lore.Uniform.Set"></a>

#### Uniform.Set(gl, program, uniform)
Pushes the uniform to the GPU.

**Kind**: static method of <code>[Uniform](#Lore.Uniform)</code>  

| Param | Type | Description |
| --- | --- | --- |
| gl | <code>WebGLRenderingContext</code> | A WebGL rendering context. |
| program | <code>WebGLUniformLocation</code> |  |
| uniform | <code>[Uniform](#Lore.Uniform)</code> |  |

<a name="Lore.Node"></a>

### Lore.Node
A class representing a node. A node is the base-class for all 3D objects.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | The type name of this object (Lore.Node). |
| id | <code>String</code> | A GUID uniquely identifying the node. |
| isVisible | <code>Boolean</code> | A boolean indicating whether or not the node is visible (rendered). |
| position | <code>[Vector3f](#Lore.Vector3f)</code> | The position of this node. |
| rotation | <code>[Quaternion](#Lore.Quaternion)</code> | The rotation of this node. |
| scale | <code>[Vector3f](#Lore.Vector3f)</code> | The scale of this node. |
| up | <code>[Vector3f](#Lore.Vector3f)</code> | The up vector associated with this node. |
| normalMatrix | <code>[Matrix3f](#Lore.Matrix3f)</code> | The normal matrix of this node. |
| modelMatrix | <code>[Matrix4f](#Lore.Matrix4f)</code> | The model matrix associated with this node. |
| isStale | <code>Boolean</code> | A boolean indicating whether or not the modelMatrix of this node is stale. |
| children | <code>[Array.&lt;Node&gt;](#Lore.Node)</code> | An array containing child-nodes. |
| parent | <code>[Node](#Lore.Node)</code> | The parent node. |


* [.Node](#Lore.Node)
    * [new Lore.Node()](#new_Lore.Node_new)
    * _instance_
        * [.applyMatrix(matrix)](#Lore.Node+applyMatrix) ⇒ <code>[Node](#Lore.Node)</code>
        * [.getUpVector()](#Lore.Node+getUpVector) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.getForwardVector()](#Lore.Node+getForwardVector) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.getRightVector()](#Lore.Node+getRightVector) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.translateOnAxis(axis, distance)](#Lore.Node+translateOnAxis) ⇒ <code>[Node](#Lore.Node)</code>
        * [.translateX(distance)](#Lore.Node+translateX) ⇒ <code>[Node](#Lore.Node)</code>
        * [.translateY(distance)](#Lore.Node+translateY) ⇒ <code>[Node](#Lore.Node)</code>
        * [.translateZ(distance)](#Lore.Node+translateZ) ⇒ <code>[Node](#Lore.Node)</code>
        * [.setTranslation(v)](#Lore.Node+setTranslation) ⇒ <code>[Node](#Lore.Node)</code>
        * [.setRotation(axis, angle)](#Lore.Node+setRotation) ⇒ <code>[Node](#Lore.Node)</code>
        * [.rotate(axis, angle)](#Lore.Node+rotate) ⇒ <code>[Node](#Lore.Node)</code>
        * [.rotateX(angle)](#Lore.Node+rotateX) ⇒ <code>[Node](#Lore.Node)</code>
        * [.rotateY(angle)](#Lore.Node+rotateY) ⇒ <code>[Node](#Lore.Node)</code>
        * [.rotateZ(angle)](#Lore.Node+rotateZ) ⇒ <code>[Node](#Lore.Node)</code>
        * [.getRotationMatrix()](#Lore.Node+getRotationMatrix) ⇒ <code>[Matrix4f](#Lore.Matrix4f)</code>
        * [.update()](#Lore.Node+update) ⇒ <code>[Node](#Lore.Node)</code>
        * [.getModelMatrix()](#Lore.Node+getModelMatrix) ⇒ <code>Float32Array</code>
    * _static_
        * [.createGUID()](#Lore.Node.createGUID) ⇒ <code>String</code>

<a name="new_Lore.Node_new"></a>

#### new Lore.Node()
Creates an instance of Node.

<a name="Lore.Node+applyMatrix"></a>

#### node.applyMatrix(matrix) ⇒ <code>[Node](#Lore.Node)</code>
Apply a matrix to the model matrix of this node.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| matrix | <code>[Matrix4f](#Lore.Matrix4f)</code> | A matrix. |

<a name="Lore.Node+getUpVector"></a>

#### node.getUpVector() ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Returns the up vector for this node.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The up vector for this node.  
<a name="Lore.Node+getForwardVector"></a>

#### node.getForwardVector() ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Returns the forward vector for this node.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The forward vector for this node.  
<a name="Lore.Node+getRightVector"></a>

#### node.getRightVector() ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Returns the right vector for this node.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The right vector for this node.  
<a name="Lore.Node+translateOnAxis"></a>

#### node.translateOnAxis(axis, distance) ⇒ <code>[Node](#Lore.Node)</code>
Translates this node on an axis.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| axis | <code>[Vector3f](#Lore.Vector3f)</code> | A vector representing an axis. |
| distance | <code>Number</code> | The distance for which to move the node along the axis. |

<a name="Lore.Node+translateX"></a>

#### node.translateX(distance) ⇒ <code>[Node](#Lore.Node)</code>
Translates the node along the x-axis.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>Number</code> | The distance for which to move the node along the x-axis. |

<a name="Lore.Node+translateY"></a>

#### node.translateY(distance) ⇒ <code>[Node](#Lore.Node)</code>
Translates the node along the y-axis.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>Number</code> | The distance for which to move the node along the y-axis. |

<a name="Lore.Node+translateZ"></a>

#### node.translateZ(distance) ⇒ <code>[Node](#Lore.Node)</code>
Translates the node along the z-axis.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>Number</code> | The distance for which to move the node along the z-axis. |

<a name="Lore.Node+setTranslation"></a>

#### node.setTranslation(v) ⇒ <code>[Node](#Lore.Node)</code>
Set the translation (position) of this node.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Node+setRotation"></a>

#### node.setRotation(axis, angle) ⇒ <code>[Node](#Lore.Node)</code>
Set the rotation from an axis and an angle.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| axis | <code>[Vector3f](#Lore.Vector3f)</code> | A vector representing an angle |
| angle | <code>Number</code> | An angle. |

<a name="Lore.Node+rotate"></a>

#### node.rotate(axis, angle) ⇒ <code>[Node](#Lore.Node)</code>
Rotate this node by an angle on an axis.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| axis | <code>[Vector3f](#Lore.Vector3f)</code> | A vector representing an angle |
| angle | <code>Number</code> | An angle. |

<a name="Lore.Node+rotateX"></a>

#### node.rotateX(angle) ⇒ <code>[Node](#Lore.Node)</code>
Rotate around the x-axis.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| angle | <code>Number</code> | An angle. |

<a name="Lore.Node+rotateY"></a>

#### node.rotateY(angle) ⇒ <code>[Node](#Lore.Node)</code>
Rotate around the y-axis.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| angle | <code>Number</code> | An angle. |

<a name="Lore.Node+rotateZ"></a>

#### node.rotateZ(angle) ⇒ <code>[Node](#Lore.Node)</code>
Rotate around the z-axis.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| angle | <code>Number</code> | An angle. |

<a name="Lore.Node+getRotationMatrix"></a>

#### node.getRotationMatrix() ⇒ <code>[Matrix4f](#Lore.Matrix4f)</code>
Get the rotation matrix for this node.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Matrix4f](#Lore.Matrix4f)</code> - This nodes rotation matrix.  
<a name="Lore.Node+update"></a>

#### node.update() ⇒ <code>[Node](#Lore.Node)</code>
Update the model matrix of this node. Has to be called in order to apply scaling, rotations or translations.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>[Node](#Lore.Node)</code> - Itself.  
<a name="Lore.Node+getModelMatrix"></a>

#### node.getModelMatrix() ⇒ <code>Float32Array</code>
Returns the model matrix as an array.

**Kind**: instance method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>Float32Array</code> - The model matrix.  
<a name="Lore.Node.createGUID"></a>

#### Node.createGUID() ⇒ <code>String</code>
Creates a GUID.

**Kind**: static method of <code>[Node](#Lore.Node)</code>  
**Returns**: <code>String</code> - A GUID.  
<a name="Lore.Geometry"></a>

### Lore.Geometry
A class representing a geometry.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>String</code> |  | The type name of this object (Lore.Geometry). |
| name | <code>String</code> |  | The name of this geometry. |
| gl | <code>WebGLRenderingContext</code> |  | A WebGL rendering context. |
| shader | <code>[Shader](#Lore.Shader)</code> |  | An initialized shader. |
| attributes | <code>Object</code> |  | A map mapping attribute names to Lore.Attrubute objects. |
| drawMode | <code>Lore.DrawMode</code> | <code>gl.POINTS</code> | The current draw mode of this geometry. |
| isVisisble | <code>Boolean</code> |  | A boolean indicating whether or not this geometry is currently visible. |

<a name="Lore.Attribute"></a>

### Lore.Attribute
A class representing an attribute.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>String</code> |  | The type name of this object (Lore.Attribute). |
| data | <code>\*</code> |  | The data represented by the attribute in a 1D array. Usually a Float32Array. |
| attributeLength | <code>Number</code> | <code>3</code> | The length of the attribute. '3' for Vector3f. |
| name | <code>String</code> |  | The name of this attribut. Must be the name used by the shader. |
| size | <code>Number</code> |  | The length of the attribute values (defined as data.length / attributeLength). |
| buffer | <code>WebGLBuffer</code> |  | The bound WebGLBuffer. |
| attributeLocation | <code>GLint</code> |  | The attribute location for this attribute. |
| bufferType | <code>GLenum</code> |  | The buffer target. As of WebGL 1: gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER. |
| drawMode | <code>GLenum</code> |  | The draw mode. As of WebGL 1: gl.STATIC_DRAW, gl.DYNAMIC_DRAW or gl.STREAM_DRAW. |
| stale | <code>Boolean</code> |  | A boolean indicating whether or not this attribute has changed and needs to be updated. |


* [.Attribute](#Lore.Attribute)
    * [new Lore.Attribute(data, attributeLength, name)](#new_Lore.Attribute_new)
    * [.setFromVector(index, v)](#Lore.Attribute+setFromVector)
    * [.setFromVectorArray(arr)](#Lore.Attribute+setFromVectorArray)
    * [.getX(index)](#Lore.Attribute+getX) ⇒ <code>Number</code>
    * [.setX(index, value)](#Lore.Attribute+setX)
    * [.getY(index)](#Lore.Attribute+getY) ⇒ <code>Number</code>
    * [.setY(index, value)](#Lore.Attribute+setY)
    * [.getZ(index)](#Lore.Attribute+getZ) ⇒ <code>Number</code>
    * [.setZ(index, value)](#Lore.Attribute+setZ)
    * [.getW(index)](#Lore.Attribute+getW) ⇒ <code>Number</code>
    * [.setW(index, value)](#Lore.Attribute+setW)
    * [.getGlType(gl)](#Lore.Attribute+getGlType) ⇒ <code>Number</code>
    * [.update(gl)](#Lore.Attribute+update)
    * [.createBuffer(gl, program, bufferType, drawMode)](#Lore.Attribute+createBuffer)
    * [.bind(gl)](#Lore.Attribute+bind)

<a name="new_Lore.Attribute_new"></a>

#### new Lore.Attribute(data, attributeLength, name)
Creates an instance of Attribute.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | The data represented by the attribute in a 1D array. Usually a Float32Array. |
| attributeLength | <code>Number</code> | The length of the attribute (3 for RGB, XYZ, ...). |
| name | <code>String</code> | The name of the attribute. |

<a name="Lore.Attribute+setFromVector"></a>

#### attribute.setFromVector(index, v)
Set the attribute value from a vector at a given index. The vector should have the same number of components as is the length of this attribute.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index at which to replace / set the value (is calculated as index * attributeLength). |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Attribute+setFromVectorArray"></a>

#### attribute.setFromVectorArray(arr)
Set the attribute values from vectors in an array.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>[Array.&lt;Vector3f&gt;](#Lore.Vector3f)</code> | An array containing vectors. The number of components of the vectors must have the same length as the attribute length specified. |

<a name="Lore.Attribute+getX"></a>

#### attribute.getX(index) ⇒ <code>Number</code>
Gets the x value at a given index.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  
**Returns**: <code>Number</code> - The x value at a given index.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index. |

<a name="Lore.Attribute+setX"></a>

#### attribute.setX(index, value)
Set the x value at a given index.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index. |
| value | <code>Number</code> | A number. |

<a name="Lore.Attribute+getY"></a>

#### attribute.getY(index) ⇒ <code>Number</code>
Gets the y value at a given index.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  
**Returns**: <code>Number</code> - The y value at a given index.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index. |

<a name="Lore.Attribute+setY"></a>

#### attribute.setY(index, value)
Set the y value at a given index.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index. |
| value | <code>Number</code> | A number. |

<a name="Lore.Attribute+getZ"></a>

#### attribute.getZ(index) ⇒ <code>Number</code>
Gets the z value at a given index.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  
**Returns**: <code>Number</code> - The z value at a given index.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index. |

<a name="Lore.Attribute+setZ"></a>

#### attribute.setZ(index, value)
Set the z value at a given index.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index. |
| value | <code>Number</code> | A number. |

<a name="Lore.Attribute+getW"></a>

#### attribute.getW(index) ⇒ <code>Number</code>
Gets the w value at a given index.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  
**Returns**: <code>Number</code> - The w value at a given index.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index. |

<a name="Lore.Attribute+setW"></a>

#### attribute.setW(index, value)
Set the w value at a given index.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index. |
| value | <code>Number</code> | A number. |

<a name="Lore.Attribute+getGlType"></a>

#### attribute.getGlType(gl) ⇒ <code>Number</code>
Returns the gl type. Currently only float is supported.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  
**Returns**: <code>Number</code> - The type.  

| Param | Type | Description |
| --- | --- | --- |
| gl | <code>WebGLRenderingContext</code> | The WebGL rendering context. |

<a name="Lore.Attribute+update"></a>

#### attribute.update(gl)
Update the attribute in order for changes to take effect.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  

| Param | Type | Description |
| --- | --- | --- |
| gl | <code>WebGLRenderingContext</code> | The WebGL rendering context. |

<a name="Lore.Attribute+createBuffer"></a>

#### attribute.createBuffer(gl, program, bufferType, drawMode)
Create a new WebGL buffer.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  

| Param | Type | Description |
| --- | --- | --- |
| gl | <code>WebGLRenderingContext</code> | The WebGL rendering context. |
| program | <code>WebGLProgram</code> | A WebGL program. |
| bufferType | <code>GLenum</code> | The buffer type. |
| drawMode | <code>GLenum</code> | The draw mode. |

<a name="Lore.Attribute+bind"></a>

#### attribute.bind(gl)
Bind the buffer of this attribute. The attribute must exist in the current shader.

**Kind**: instance method of <code>[Attribute](#Lore.Attribute)</code>  

| Param | Type | Description |
| --- | --- | --- |
| gl | <code>WebGLRenderingContext</code> | The WebGL rendering context. |

<a name="Lore.ControlsBase"></a>

### Lore.ControlsBase
An abstract class representing the base for controls implementations.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| renderer | <code>[Renderer](#Lore.Renderer)</code> | A Lore.Renderer instance. |
| camera | <code>[CameraBase](#Lore.CameraBase)</code> | A Lore.CameraBase extending object. |
| canvas | <code>HTMLElement</code> | A canvas HTMLElement. |
| lowFps | <code>Number</code> | The FPS limit when throttling FPS. |
| highFps | <code>Number</code> | The FPS limit when not throttling FPS. |
| touchMode | <code>String</code> | The current touch mode. |
| lookAt | <code>[Vector3f](#Lore.Vector3f)</code> | The current lookat associated with these controls. |


* [.ControlsBase](#Lore.ControlsBase)
    * [new Lore.ControlsBase(renderer, [lookAt], [enableVR])](#new_Lore.ControlsBase_new)
    * [.initWebVR()](#Lore.ControlsBase+initWebVR)
    * [.addEventListener(eventName, callback)](#Lore.ControlsBase+addEventListener)
    * [.removeEventListener(eventName, callback)](#Lore.ControlsBase+removeEventListener)
    * [.raiseEvent(eventName, data)](#Lore.ControlsBase+raiseEvent)
    * [.getLookAt()](#Lore.ControlsBase+getLookAt) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
    * [.setLookAt(lookAt)](#Lore.ControlsBase+setLookAt) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.update(e, source)](#Lore.ControlsBase+update) ⇒ <code>[ControlsBase](#Lore.ControlsBase)</code>

<a name="new_Lore.ControlsBase_new"></a>

#### new Lore.ControlsBase(renderer, [lookAt], [enableVR])
Creates an instance of ControlsBase.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| renderer | <code>[Renderer](#Lore.Renderer)</code> |  | An instance of a Lore renderer. |
| [lookAt] | <code>Boolean</code> | <code>new Lore.Vector3f()</code> | The look at vector of the controls. |
| [enableVR] | <code>Boolean</code> | <code>false</code> | Whether or not to track phone spatial information using the WebVR API. |

<a name="Lore.ControlsBase+initWebVR"></a>

#### controlsBase.initWebVR()
Initialiizes WebVR, if the API is available and the device suppports it.

**Kind**: instance method of <code>[ControlsBase](#Lore.ControlsBase)</code>  
<a name="Lore.ControlsBase+addEventListener"></a>

#### controlsBase.addEventListener(eventName, callback)
Adds an event listener to this controls instance.

**Kind**: instance method of <code>[ControlsBase](#Lore.ControlsBase)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | The name of the event that is to be listened for. |
| callback | <code>function</code> | A callback function to be called on the event being fired. |

<a name="Lore.ControlsBase+removeEventListener"></a>

#### controlsBase.removeEventListener(eventName, callback)
Remove an event listener from this controls instance.

**Kind**: instance method of <code>[ControlsBase](#Lore.ControlsBase)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | The name of the event that is to be listened for. |
| callback | <code>function</code> | A callback function to be called on the event being fired. |

<a name="Lore.ControlsBase+raiseEvent"></a>

#### controlsBase.raiseEvent(eventName, data)
Raises an event.

**Kind**: instance method of <code>[ControlsBase](#Lore.ControlsBase)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | The name of the event to be raised. |
| data | <code>\*</code> | The data to be supplied to the callback function. |

<a name="Lore.ControlsBase+getLookAt"></a>

#### controlsBase.getLookAt() ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Returns the current look at vector associated with this controls.

**Kind**: instance method of <code>[ControlsBase](#Lore.ControlsBase)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The current look at vector.  
<a name="Lore.ControlsBase+setLookAt"></a>

#### controlsBase.setLookAt(lookAt) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Sets the lookat vector, which is the center of the orbital camera sphere.

**Kind**: instance method of <code>[ControlsBase](#Lore.ControlsBase)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| lookAt | <code>[Vector3f](#Lore.Vector3f)</code> | The lookat vector. |

<a name="Lore.ControlsBase+update"></a>

#### controlsBase.update(e, source) ⇒ <code>[ControlsBase](#Lore.ControlsBase)</code>
Update the camera (on mouse move, touch drag, mousewheel scroll, ...).

**Kind**: instance method of <code>[ControlsBase](#Lore.ControlsBase)</code>  
**Returns**: <code>[ControlsBase](#Lore.ControlsBase)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>\*</code> | A mouse or touch events data. |
| source | <code>String</code> | The source of the input ('left', 'middle', 'right', 'wheel', ...). |

<a name="Lore.OrbitalControls"></a>

### Lore.OrbitalControls
A class representing orbital controls.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| up | <code>[Vector3f](#Lore.Vector3f)</code> |  | The global up vector. |
| radius | <code>Number</code> |  | The distance from the camera to the lookat vector. |
| yRotationLimit | <code>Number</code> | <code>Math.PI</code> | The limit for the vertical rotation. |
| spherical | <code>[SphericalCoords](#Lore.SphericalCoords)</code> |  | The spherical coordinates of the camera on the sphere around the lookat vector. |
| scale | <code>Number</code> |  | The sensitivity scale. |
| camera | <code>[CameraBase](#Lore.CameraBase)</code> |  | The camera associated with these controls. |


* [.OrbitalControls](#Lore.OrbitalControls)
    * [new Lore.OrbitalControls(renderer, radius, lookAt)](#new_Lore.OrbitalControls_new)
    * [.limitRotationToHorizon(limit)](#Lore.OrbitalControls+limitRotationToHorizon) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.setRadius(radius)](#Lore.OrbitalControls+setRadius) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.update(e, source)](#Lore.OrbitalControls+update) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.setView(phi, theta)](#Lore.OrbitalControls+setView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.zoomIn()](#Lore.OrbitalControls+zoomIn) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.zoomOut()](#Lore.OrbitalControls+zoomOut) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.setZoom(zoom)](#Lore.OrbitalControls+setZoom) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.setTopView()](#Lore.OrbitalControls+setTopView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.setBottomView()](#Lore.OrbitalControls+setBottomView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.setRightView()](#Lore.OrbitalControls+setRightView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.setLeftView()](#Lore.OrbitalControls+setLeftView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.setFrontView()](#Lore.OrbitalControls+setFrontView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.setBackView()](#Lore.OrbitalControls+setBackView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
    * [.setFreeView()](#Lore.OrbitalControls+setFreeView) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>

<a name="new_Lore.OrbitalControls_new"></a>

#### new Lore.OrbitalControls(renderer, radius, lookAt)
Creates an instance of OrbitalControls.


| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>[Renderer](#Lore.Renderer)</code> | An instance of a Lore renderer. |
| radius | <code>Lore.Number</code> | The distance of the camera to the lookat vector. |
| lookAt | <code>[Vector3f](#Lore.Vector3f)</code> | The lookat vector. |

<a name="Lore.OrbitalControls+limitRotationToHorizon"></a>

#### orbitalControls.limitRotationToHorizon(limit) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Limit the vertical rotation to the horizon (the upper hemisphere).

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| limit | <code>Boolean</code> | A boolean indicating whether or not to limit the vertical rotation to the horizon. |

<a name="Lore.OrbitalControls+setRadius"></a>

#### orbitalControls.setRadius(radius) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Sets the distance (radius of the sphere) from the lookat vector to the camera.

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| radius | <code>Number</code> | The radius. |

<a name="Lore.OrbitalControls+update"></a>

#### orbitalControls.update(e, source) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Update the camera (on mouse move, touch drag, mousewheel scroll, ...).

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>\*</code> | A mouse or touch events data. |
| source | <code>String</code> | The source of the input ('left', 'middle', 'right', 'wheel', ...). |

<a name="Lore.OrbitalControls+setView"></a>

#### orbitalControls.setView(phi, theta) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Moves the camera around the sphere by spherical coordinates.

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| phi | <code>Number</code> | The phi component of the spherical coordinates. |
| theta | <code>Number</code> | The theta component of the spherical coordinates. |

<a name="Lore.OrbitalControls+zoomIn"></a>

#### orbitalControls.zoomIn() ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Zoom in on the lookat vector.

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  
<a name="Lore.OrbitalControls+zoomOut"></a>

#### orbitalControls.zoomOut() ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Zoom out from the lookat vector.

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  
<a name="Lore.OrbitalControls+setZoom"></a>

#### orbitalControls.setZoom(zoom) ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Set the zoom to a given value.

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| zoom | <code>Number</code> | The zoom value. |

<a name="Lore.OrbitalControls+setTopView"></a>

#### orbitalControls.setTopView() ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Set the camera to the top view (locks rotation).

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  
<a name="Lore.OrbitalControls+setBottomView"></a>

#### orbitalControls.setBottomView() ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Set the camera to the bottom view (locks rotation).

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  
<a name="Lore.OrbitalControls+setRightView"></a>

#### orbitalControls.setRightView() ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Set the camera to the right view (locks rotation).

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  
<a name="Lore.OrbitalControls+setLeftView"></a>

#### orbitalControls.setLeftView() ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Set the camera to the left view (locks rotation).

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  
<a name="Lore.OrbitalControls+setFrontView"></a>

#### orbitalControls.setFrontView() ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Set the camera to the front view (locks rotation).

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  
<a name="Lore.OrbitalControls+setBackView"></a>

#### orbitalControls.setBackView() ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Set the camera to the back view (locks rotation).

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  
<a name="Lore.OrbitalControls+setFreeView"></a>

#### orbitalControls.setFreeView() ⇒ <code>[OrbitalControls](#Lore.OrbitalControls)</code>
Set the camera to free view (unlocks rotation).

**Kind**: instance method of <code>[OrbitalControls](#Lore.OrbitalControls)</code>  
**Returns**: <code>[OrbitalControls](#Lore.OrbitalControls)</code> - Returns itself.  
<a name="Lore.FirstPersonControls"></a>

### Lore.FirstPersonControls
A class representing orbital controls.

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.FirstPersonControls](#Lore.FirstPersonControls)
    * [new Lore.FirstPersonControls(renderer)](#new_Lore.FirstPersonControls_new)
    * [.update(e, source)](#Lore.FirstPersonControls+update) ⇒ <code>FirstPersonControls</code>

<a name="new_Lore.FirstPersonControls_new"></a>

#### new Lore.FirstPersonControls(renderer)
Creates an instance of FirstPersonControls.


| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>Renderer</code> | An instance of a Lore renderer. |

<a name="Lore.FirstPersonControls+update"></a>

#### firstPersonControls.update(e, source) ⇒ <code>FirstPersonControls</code>
Update the camera (on mouse move, touch drag, mousewheel scroll, ...).

**Kind**: instance method of <code>[FirstPersonControls](#Lore.FirstPersonControls)</code>  
**Returns**: <code>FirstPersonControls</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>any</code> | A mouse or touch events data. |
| source | <code>String</code> | The source of the input ('left', 'middle', 'right', 'wheel', ...). |

<a name="Lore.CameraBase"></a>

### Lore.CameraBase
An abstract class representing the base for camera implementations.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type name of this object (Lore.CameraBase). |
| renderer | <code>[Renderer](#Lore.Renderer)</code> | A Lore.Renderer object. |
| isProjectionMatrixStale | <code>boolean</code> | A boolean indicating whether or not the projection matrix was changed and has to be updated. |
| projectionMatrix | <code>[ProjectionMatrix](#Lore.ProjectionMatrix)</code> | A Lore.ProjectionMatrix object. |
| viewMatrix | <code>[Matrix4f](#Lore.Matrix4f)</code> | A Lore.Matrix4f object representing the view matrix for this camera. |


* [.CameraBase](#Lore.CameraBase)
    * [new Lore.CameraBase()](#new_Lore.CameraBase_new)
    * [.init(gl, program)](#Lore.CameraBase+init) ⇒ <code>CameraBase</code>
    * [.setLookAt(vec)](#Lore.CameraBase+setLookAt) ⇒ <code>CameraBase</code>
    * [.updateViewport(width, height)](#Lore.CameraBase+updateViewport)
    * [.updateProjectionMatrix()](#Lore.CameraBase+updateProjectionMatrix) ⇒ <code>Vector3f</code>
    * [.updateViewMatrix()](#Lore.CameraBase+updateViewMatrix) ⇒ <code>Vector3f</code>
    * [.getProjectionMatrix()](#Lore.CameraBase+getProjectionMatrix) ⇒ <code>Float32Array</code>
    * [.getViewMatrix()](#Lore.CameraBase+getViewMatrix) ⇒ <code>Float32Array</code>
    * [.sceneToScreen(vec, renderer)](#Lore.CameraBase+sceneToScreen) ⇒ <code>Array</code>

<a name="new_Lore.CameraBase_new"></a>

#### new Lore.CameraBase()
Creates an instance of CameraBase.

<a name="Lore.CameraBase+init"></a>

#### cameraBase.init(gl, program) ⇒ <code>CameraBase</code>
Initializes this camera instance.

**Kind**: instance method of <code>[CameraBase](#Lore.CameraBase)</code>  
**Returns**: <code>CameraBase</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| gl | <code>any</code> | A gl context. |
| program | <code>any</code> | A program pointer. |

<a name="Lore.CameraBase+setLookAt"></a>

#### cameraBase.setLookAt(vec) ⇒ <code>CameraBase</code>
Sets the lookat of this camera instance.

**Kind**: instance method of <code>[CameraBase](#Lore.CameraBase)</code>  
**Returns**: <code>CameraBase</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| vec | <code>Vector3f</code> | The vector to set the lookat to. |

<a name="Lore.CameraBase+updateViewport"></a>

#### cameraBase.updateViewport(width, height)
Has to be called when the viewport size changes (e.g. window resize).

**Kind**: instance method of <code>[CameraBase](#Lore.CameraBase)</code>  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>Number</code> | The width of the viewport. |
| height | <code>Number</code> | The height of the viewport. |

<a name="Lore.CameraBase+updateProjectionMatrix"></a>

#### cameraBase.updateProjectionMatrix() ⇒ <code>Vector3f</code>
Virtual Method

**Kind**: instance method of <code>[CameraBase](#Lore.CameraBase)</code>  
**Returns**: <code>Vector3f</code> - Returns itself.  
<a name="Lore.CameraBase+updateViewMatrix"></a>

#### cameraBase.updateViewMatrix() ⇒ <code>Vector3f</code>
Upates the view matrix of this camera.

**Kind**: instance method of <code>[CameraBase](#Lore.CameraBase)</code>  
**Returns**: <code>Vector3f</code> - Returns itself.  
<a name="Lore.CameraBase+getProjectionMatrix"></a>

#### cameraBase.getProjectionMatrix() ⇒ <code>Float32Array</code>
Returns the projection matrix of this camera instance as an array.

**Kind**: instance method of <code>[CameraBase](#Lore.CameraBase)</code>  
**Returns**: <code>Float32Array</code> - The entries of the projection matrix.  
<a name="Lore.CameraBase+getViewMatrix"></a>

#### cameraBase.getViewMatrix() ⇒ <code>Float32Array</code>
Returns the view matrix of this camera instance as an array.

**Kind**: instance method of <code>[CameraBase](#Lore.CameraBase)</code>  
**Returns**: <code>Float32Array</code> - The entries of the view matrix.  
<a name="Lore.CameraBase+sceneToScreen"></a>

#### cameraBase.sceneToScreen(vec, renderer) ⇒ <code>Array</code>
Projects a vector into screen space.

**Kind**: instance method of <code>[CameraBase](#Lore.CameraBase)</code>  
**Returns**: <code>Array</code> - An array containing the x and y position in screen space.  

| Param | Type | Description |
| --- | --- | --- |
| vec | <code>Vector3f</code> | A vector. |
| renderer | <code>Renderer</code> | An instance of a Lore renderer. |

<a name="Lore.OrthographicCamera"></a>

### Lore.OrthographicCamera
A class representing an orthographic camera.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| zoom | <code>number</code> | <code>1.0</code> | The zoom value of this camera. |
| left | <code>number</code> |  | The left border of the frustum. |
| right | <code>number</code> |  | The right border of the frustum. |
| top | <code>number</code> |  | The top border of the frustum. |
| bottom | <code>number</code> |  | The bottom border of the frustum. |
| near | <code>number</code> |  | The near plane distance of the frustum. |
| far | <code>number</code> |  | The far plane distance of the frustum. |


* [.OrthographicCamera](#Lore.OrthographicCamera)
    * [new Lore.OrthographicCamera(left, right, top, bottom, near, far)](#new_Lore.OrthographicCamera_new)
    * [.updateProjectionMatrix()](#Lore.OrthographicCamera+updateProjectionMatrix)
    * [.updateViewport(width, height)](#Lore.OrthographicCamera+updateViewport)

<a name="new_Lore.OrthographicCamera_new"></a>

#### new Lore.OrthographicCamera(left, right, top, bottom, near, far)
Creates an instance of OrthographicCamera.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| left | <code>Number</code> |  | Left extend of the viewing volume. |
| right | <code>Number</code> |  | Right extend of the viewing volume. |
| top | <code>Number</code> |  | Top extend of the viewing volume. |
| bottom | <code>Number</code> |  | Bottom extend of the viewing volume. |
| near | <code>Number</code> | <code>0.1</code> | Near extend of the viewing volume. |
| far | <code>Number</code> | <code>2500</code> | Far extend of the viewing volume. |

<a name="Lore.OrthographicCamera+updateProjectionMatrix"></a>

#### orthographicCamera.updateProjectionMatrix()
Updates the projection matrix of this orthographic camera.

**Kind**: instance method of <code>[OrthographicCamera](#Lore.OrthographicCamera)</code>  
<a name="Lore.OrthographicCamera+updateViewport"></a>

#### orthographicCamera.updateViewport(width, height)
Has to be called when the viewport size changes (e.g. window resize).

**Kind**: instance method of <code>[OrthographicCamera](#Lore.OrthographicCamera)</code>  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>Number</code> | The width of the viewport. |
| height | <code>Number</code> | The height of the viewport. |

<a name="Lore.PerspectiveCamera"></a>

### Lore.PerspectiveCamera
A class representing an perspective camera.

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.PerspectiveCamera](#Lore.PerspectiveCamera)
    * [new Lore.PerspectiveCamera(fov, aspect, near, far)](#new_Lore.PerspectiveCamera_new)
    * [.updateProjectionMatrix()](#Lore.PerspectiveCamera+updateProjectionMatrix)
    * [.updateViewport(width, height)](#Lore.PerspectiveCamera+updateViewport)

<a name="new_Lore.PerspectiveCamera_new"></a>

#### new Lore.PerspectiveCamera(fov, aspect, near, far)
Creates an instance of PerspectiveCamera.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fov | <code>Number</code> |  | The field of view. |
| aspect | <code>Number</code> |  | The aspect ration (width / height). |
| near | <code>Number</code> | <code>0.1</code> | Near extend of the viewing volume. |
| far | <code>Number</code> | <code>2500</code> | Far extend of the viewing volume. |

<a name="Lore.PerspectiveCamera+updateProjectionMatrix"></a>

#### perspectiveCamera.updateProjectionMatrix()
Updates the projection matrix of this perspective camera.

**Kind**: instance method of <code>[PerspectiveCamera](#Lore.PerspectiveCamera)</code>  
<a name="Lore.PerspectiveCamera+updateViewport"></a>

#### perspectiveCamera.updateViewport(width, height)
Has to be called when the viewport size changes (e.g. window resize).

**Kind**: instance method of <code>[PerspectiveCamera](#Lore.PerspectiveCamera)</code>  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>Number</code> | The width of the viewport. |
| height | <code>Number</code> | The height of the viewport. |

<a name="Lore.Vector3f"></a>

### Lore.Vector3f
A class representing 3D float vector.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| components | <code>Float32Array</code> | A typed array storing the components of this vector. |


* [.Vector3f](#Lore.Vector3f)
    * [new Lore.Vector3f(x, y, z)](#new_Lore.Vector3f_new)
    * _instance_
        * [.set(x, y, z)](#Lore.Vector3f+set) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.getX()](#Lore.Vector3f+getX) ⇒ <code>Number</code>
        * [.getY()](#Lore.Vector3f+getY) ⇒ <code>Number</code>
        * [.getZ()](#Lore.Vector3f+getZ) ⇒ <code>Number</code>
        * [.setX(x)](#Lore.Vector3f+setX) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.setY(y)](#Lore.Vector3f+setY) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.setZ(z)](#Lore.Vector3f+setZ) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.setFromSphericalCoords(s)](#Lore.Vector3f+setFromSphericalCoords) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.copyFrom(v)](#Lore.Vector3f+copyFrom) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.setLength(length)](#Lore.Vector3f+setLength) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.lengthSq()](#Lore.Vector3f+lengthSq) ⇒ <code>Number</code>
        * [.length()](#Lore.Vector3f+length) ⇒ <code>Number</code>
        * [.normalize()](#Lore.Vector3f+normalize) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.multiply(v)](#Lore.Vector3f+multiply) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.multiplyScalar(s)](#Lore.Vector3f+multiplyScalar) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.divide(v)](#Lore.Vector3f+divide) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.divideScalar(s)](#Lore.Vector3f+divideScalar) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.add(v)](#Lore.Vector3f+add) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.subtract(v)](#Lore.Vector3f+subtract) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.dot(v)](#Lore.Vector3f+dot) ⇒ <code>Number</code>
        * [.cross(v)](#Lore.Vector3f+cross) ⇒ <code>Number</code>
        * [.project(camera)](#Lore.Vector3f+project) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.unproject(camera)](#Lore.Vector3f+unproject) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.applyProjection(m)](#Lore.Vector3f+applyProjection) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.toDirection(m)](#Lore.Vector3f+toDirection) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.applyQuaternion(q)](#Lore.Vector3f+applyQuaternion) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.distanceToSq(v)](#Lore.Vector3f+distanceToSq) ⇒ <code>Number</code>
        * [.distanceTo(v)](#Lore.Vector3f+distanceTo) ⇒ <code>Number</code>
        * [.clone()](#Lore.Vector3f+clone) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.equals(v)](#Lore.Vector3f+equals) ⇒ <code>Boolean</code>
        * [.toString()](#Lore.Vector3f+toString) ⇒ <code>String</code>
    * _static_
        * [.normalize(v)](#Lore.Vector3f.normalize) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.multiply(u, v)](#Lore.Vector3f.multiply) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.multiplyScalar(v, s)](#Lore.Vector3f.multiplyScalar) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.divide(u, v)](#Lore.Vector3f.divide) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.divideScalar(v, s)](#Lore.Vector3f.divideScalar) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.add(u, v)](#Lore.Vector3f.add) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.subtract(u, v)](#Lore.Vector3f.subtract) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.cross(u, v)](#Lore.Vector3f.cross) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.dot(u, v)](#Lore.Vector3f.dot) ⇒ <code>Number</code>
        * [.forward()](#Lore.Vector3f.forward) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.up()](#Lore.Vector3f.up) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.right()](#Lore.Vector3f.right) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>

<a name="new_Lore.Vector3f_new"></a>

#### new Lore.Vector3f(x, y, z)
Creates an instance of Vector3f.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x component of the vector. |
| y | <code>Number</code> | The y component of the vector. |
| z | <code>Number</code> | The z component of the vector. |

<a name="Lore.Vector3f+set"></a>

#### vector3f.set(x, y, z) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Sets the x, y and z components of this vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x component of the vector. |
| y | <code>Number</code> | The y component of the vector. |
| z | <code>Number</code> | The z component of the vector. |

<a name="Lore.Vector3f+getX"></a>

#### vector3f.getX() ⇒ <code>Number</code>
Gets the x component of this vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Number</code> - The x component of this vector.  
<a name="Lore.Vector3f+getY"></a>

#### vector3f.getY() ⇒ <code>Number</code>
Gets the y component of this vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Number</code> - The y component of this vector.  
<a name="Lore.Vector3f+getZ"></a>

#### vector3f.getZ() ⇒ <code>Number</code>
Gets the z component of this vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Number</code> - The z component of this vector.  
<a name="Lore.Vector3f+setX"></a>

#### vector3f.setX(x) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Sets the x component of this vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The value to which the x component of this vectors will be set. |

<a name="Lore.Vector3f+setY"></a>

#### vector3f.setY(y) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Sets the y component of this vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| y | <code>Number</code> | The value to which the y component of this vectors will be set. |

<a name="Lore.Vector3f+setZ"></a>

#### vector3f.setZ(z) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Sets the z component of this vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| z | <code>Number</code> | The value to which the z component of this vectors will be set. |

<a name="Lore.Vector3f+setFromSphericalCoords"></a>

#### vector3f.setFromSphericalCoords(s) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Sets this vector from spherical coordinates.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>Lore.SphericalCoordinates</code> | A spherical coordinates object. |

<a name="Lore.Vector3f+copyFrom"></a>

#### vector3f.copyFrom(v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Copies the values from another vector

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f+setLength"></a>

#### vector3f.setLength(length) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Set the length / magnitude of the vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>Number</code> | The length / magnitude to set the vector to. |

<a name="Lore.Vector3f+lengthSq"></a>

#### vector3f.lengthSq() ⇒ <code>Number</code>
Get the square of the length / magnitude of the vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Number</code> - The square of length / magnitude of the vector.  
<a name="Lore.Vector3f+length"></a>

#### vector3f.length() ⇒ <code>Number</code>
The length / magnitude of the vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Number</code> - The length / magnitude of the vector.  
<a name="Lore.Vector3f+normalize"></a>

#### vector3f.normalize() ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Normalizes the vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  
<a name="Lore.Vector3f+multiply"></a>

#### vector3f.multiply(v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Multiply the vector with another vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f+multiplyScalar"></a>

#### vector3f.multiplyScalar(s) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Multiplies this vector with a scalar.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>Number</code> | A scalar. |

<a name="Lore.Vector3f+divide"></a>

#### vector3f.divide(v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Divides the vector by another vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f+divideScalar"></a>

#### vector3f.divideScalar(s) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Divides the vector by a scalar.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>Number</code> | A scalar. |

<a name="Lore.Vector3f+add"></a>

#### vector3f.add(v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Sums the vector with another.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f+subtract"></a>

#### vector3f.subtract(v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Substracts a vector from this one.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f+dot"></a>

#### vector3f.dot(v) ⇒ <code>Number</code>
Calculates the dot product for the vector with another vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Number</code> - The dot product of the two vectors.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f+cross"></a>

#### vector3f.cross(v) ⇒ <code>Number</code>
Calculates the cross product for the vector with another vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Number</code> - The cross product of the two vectors.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f+project"></a>

#### vector3f.project(camera) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Projects the vector from world space into camera space.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The vector in camera space.  

| Param | Type | Description |
| --- | --- | --- |
| camera | <code>[CameraBase](#Lore.CameraBase)</code> | A camera instance. |

<a name="Lore.Vector3f+unproject"></a>

#### vector3f.unproject(camera) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Projects the vector from camera space into world space.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The vector in world space.  

| Param | Type | Description |
| --- | --- | --- |
| camera | <code>[CameraBase](#Lore.CameraBase)</code> | A camera instance. |

<a name="Lore.Vector3f+applyProjection"></a>

#### vector3f.applyProjection(m) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Applies a projection matrix to the vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| m | <code>[Matrix4f](#Lore.Matrix4f)</code> | A (projection) matrix. |

<a name="Lore.Vector3f+toDirection"></a>

#### vector3f.toDirection(m) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Rotates the vector into the direction defined by the rotational component of a matrix.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| m | <code>[Matrix4f](#Lore.Matrix4f)</code> | A matrix. |

<a name="Lore.Vector3f+applyQuaternion"></a>

#### vector3f.applyQuaternion(q) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Applies a quaternion to the vector (usually a rotation).

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | Quaternion. |

<a name="Lore.Vector3f+distanceToSq"></a>

#### vector3f.distanceToSq(v) ⇒ <code>Number</code>
Calculates the square of the distance to another vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Number</code> - The square of the distance to the other vector.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f+distanceTo"></a>

#### vector3f.distanceTo(v) ⇒ <code>Number</code>
Calculates the distance to another vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Number</code> - The distance to the other vector.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f+clone"></a>

#### vector3f.clone() ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Clones this vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - A clone of this vector.  
<a name="Lore.Vector3f+equals"></a>

#### vector3f.equals(v) ⇒ <code>Boolean</code>
Compares the components of the vector to those of another.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Boolean</code> - A vector indicating whether or not the two vectors are equal.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f+toString"></a>

#### vector3f.toString() ⇒ <code>String</code>
Returns a string representation of the vector.

**Kind**: instance method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>String</code> - A string representation of the vector.  
<a name="Lore.Vector3f.normalize"></a>

#### Vector3f.normalize(v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Normalizes a vector.

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The noramlized vector.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f.multiply"></a>

#### Vector3f.multiply(u, v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Multiplies two vectors.

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The product of the two vectors.  

| Param | Type | Description |
| --- | --- | --- |
| u | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f.multiplyScalar"></a>

#### Vector3f.multiplyScalar(v, s) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Multiplies a vector with a scalar.

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The vector multiplied by the scalar.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |
| s | <code>Number</code> | A scalar. |

<a name="Lore.Vector3f.divide"></a>

#### Vector3f.divide(u, v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Divides a vector by another vector (u / v).

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The fraction vector.  

| Param | Type | Description |
| --- | --- | --- |
| u | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f.divideScalar"></a>

#### Vector3f.divideScalar(v, s) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Divides a vector by a scalar.

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The vector divided by the scalar.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |
| s | <code>Number</code> | A scalar. |

<a name="Lore.Vector3f.add"></a>

#### Vector3f.add(u, v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Sums two vectors.

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The sum of the two vectors.  

| Param | Type | Description |
| --- | --- | --- |
| u | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f.subtract"></a>

#### Vector3f.subtract(u, v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Subtracts one scalar from another (u - v)

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The difference between the two vectors.  

| Param | Type | Description |
| --- | --- | --- |
| u | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f.cross"></a>

#### Vector3f.cross(u, v) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Calculates the cross product of two vectors.

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The cross product of the two vectors.  

| Param | Type | Description |
| --- | --- | --- |
| u | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f.dot"></a>

#### Vector3f.dot(u, v) ⇒ <code>Number</code>
Calculates the dot product of two vectors.

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>Number</code> - The dot product of the two vectors.  

| Param | Type | Description |
| --- | --- | --- |
| u | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |
| v | <code>[Vector3f](#Lore.Vector3f)</code> | A vector. |

<a name="Lore.Vector3f.forward"></a>

#### Vector3f.forward() ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Returns the forward vector (0, 0, 1).

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The forward vector.  
<a name="Lore.Vector3f.up"></a>

#### Vector3f.up() ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Returns the up vector (0, 1, 0).

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The up vector.  
<a name="Lore.Vector3f.right"></a>

#### Vector3f.right() ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Returns the right vector (1, 0, 0).

**Kind**: static method of <code>[Vector3f](#Lore.Vector3f)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The right vector.  
<a name="Lore.Matrix3f"></a>

### Lore.Matrix3f
A class representing a 3x3 float matrix

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.Matrix3f](#Lore.Matrix3f)
    * [new Lore.Matrix3f([entries])](#new_Lore.Matrix3f_new)
    * [.clone()](#Lore.Matrix3f+clone) ⇒ <code>Matrix3f</code>
    * [.equals(mat)](#Lore.Matrix3f+equals) ⇒ <code>boolean</code>

<a name="new_Lore.Matrix3f_new"></a>

#### new Lore.Matrix3f([entries])
The constructor for the class Matrix3f.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [entries] | <code>Float32Array</code> | <code>new Float32Array(...)</code> | The Float32Array to which the entries will be set. If no value is provided, the matrix will be initialized to the identity matrix. |

<a name="Lore.Matrix3f+clone"></a>

#### matrix3f.clone() ⇒ <code>Matrix3f</code>
Clones the matrix and returns the clone as a new Matrix3f object.

**Kind**: instance method of <code>[Matrix3f](#Lore.Matrix3f)</code>  
**Returns**: <code>Matrix3f</code> - The clone.  
<a name="Lore.Matrix3f+equals"></a>

#### matrix3f.equals(mat) ⇒ <code>boolean</code>
Compares this matrix to another matrix.

**Kind**: instance method of <code>[Matrix3f](#Lore.Matrix3f)</code>  
**Returns**: <code>boolean</code> - A boolean indicating whether or not the two matrices are identical.  

| Param | Type | Description |
| --- | --- | --- |
| mat | <code>Matrix3f</code> | A matrix to be compared to this matrix. |

<a name="Lore.Matrix4f"></a>

### Lore.Matrix4f
A class representing a 4x4 float matrix

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.Matrix4f](#Lore.Matrix4f)
    * [new Lore.Matrix4f([entries])](#new_Lore.Matrix4f_new)
    * _instance_
        * [.set(m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33)](#Lore.Matrix4f+set) ⇒ <code>Matrix4f</code>
        * [.multiplyA(b)](#Lore.Matrix4f+multiplyA) ⇒ <code>Matrix4f</code>
        * [.multiplyB(a)](#Lore.Matrix4f+multiplyB) ⇒ <code>Matrix4f</code>
        * [.scale(v)](#Lore.Matrix4f+scale) ⇒ <code>Matrix4f</code>
        * [.setPosition(vec)](#Lore.Matrix4f+setPosition) ⇒ <code>Matrix4f</code>
        * [.setRotation(q)](#Lore.Matrix4f+setRotation) ⇒ <code>Matrix4f</code>
        * [.determinant()](#Lore.Matrix4f+determinant) ⇒ <code>Number</code>
        * [.decompose(outPosition, outQuaternion, outScale)](#Lore.Matrix4f+decompose) ⇒ <code>Matrix4f</code>
        * [.compose(position, quaternion, scale)](#Lore.Matrix4f+compose) ⇒ <code>Matrix4f</code>
        * [.invert()](#Lore.Matrix4f+invert) ⇒ <code>Matrix4f</code>
        * [.clone()](#Lore.Matrix4f+clone) ⇒ <code>Matrix4f</code>
        * [.equals(a)](#Lore.Matrix4f+equals) ⇒ <code>Boolean</code>
        * [.toString()](#Lore.Matrix4f+toString) ⇒ <code>String</code>
    * _static_
        * [.multiply(a, b)](#Lore.Matrix4f.multiply) ⇒ <code>Matrix4f</code>
        * [.fromQuaternion(q)](#Lore.Matrix4f.fromQuaternion) ⇒ <code>Matrix4f</code>
        * [.lookAt(cameraPosition, target, up)](#Lore.Matrix4f.lookAt) ⇒ <code>Matrix4f</code>
        * [.compose(position, quaternion, scale)](#Lore.Matrix4f.compose) ⇒ <code>Matrix4f</code>
        * [.invert(matrix)](#Lore.Matrix4f.invert) ⇒

<a name="new_Lore.Matrix4f_new"></a>

#### new Lore.Matrix4f([entries])
Creates an instance of Matrix4f.


| Param | Type | Default |
| --- | --- | --- |
| [entries] | <code>Float32Array</code> | <code>new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])</code> | 

<a name="Lore.Matrix4f+set"></a>

#### matrix4f.set(m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33) ⇒ <code>Matrix4f</code>
**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| m00 | <code>Number</code> | A matrix entry. |
| m10 | <code>Number</code> | A matrix entry. |
| m20 | <code>Number</code> | A matrix entry. |
| m30 | <code>Number</code> | A matrix entry. |
| m01 | <code>Number</code> | A matrix entry. |
| m11 | <code>Number</code> | A matrix entry. |
| m21 | <code>Number</code> | A matrix entry. |
| m31 | <code>Number</code> | A matrix entry. |
| m02 | <code>Number</code> | A matrix entry. |
| m12 | <code>Number</code> | A matrix entry. |
| m22 | <code>Number</code> | A matrix entry. |
| m32 | <code>Number</code> | A matrix entry. |
| m03 | <code>Number</code> | A matrix entry. |
| m13 | <code>Number</code> | A matrix entry. |
| m23 | <code>Number</code> | A matrix entry. |
| m33 | <code>Number</code> | A matrix entry. |

<a name="Lore.Matrix4f+multiplyA"></a>

#### matrix4f.multiplyA(b) ⇒ <code>Matrix4f</code>
Multiplies this matrix with another matrix (a * b).

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| b | <code>any</code> | Another matrix. |

<a name="Lore.Matrix4f+multiplyB"></a>

#### matrix4f.multiplyB(a) ⇒ <code>Matrix4f</code>
Multiplies another matrix with this matrix (a * b).

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>any</code> | Another matrix. |

<a name="Lore.Matrix4f+scale"></a>

#### matrix4f.scale(v) ⇒ <code>Matrix4f</code>
Set the scale component of this matrix.

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>Vector3f</code> | The scaling vector. |

<a name="Lore.Matrix4f+setPosition"></a>

#### matrix4f.setPosition(vec) ⇒ <code>Matrix4f</code>
Set the position component of this matrix.

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| vec | <code>any</code> | The position vector. |

<a name="Lore.Matrix4f+setRotation"></a>

#### matrix4f.setRotation(q) ⇒ <code>Matrix4f</code>
Set the rotation component of this matrix.

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>Quaternion</code> | A quaternion representing the rotation. |

<a name="Lore.Matrix4f+determinant"></a>

#### matrix4f.determinant() ⇒ <code>Number</code>
Get the determinant of the matrix.

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Number</code> - The determinant of this matrix.  
<a name="Lore.Matrix4f+decompose"></a>

#### matrix4f.decompose(outPosition, outQuaternion, outScale) ⇒ <code>Matrix4f</code>
Decomposes the matrix into its positional, rotational and scaling component.

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| outPosition | <code>Vector3f</code> | The positional component will be written to this vector. |
| outQuaternion | <code>Quaternion</code> | The rotational component will be written to this quaternion. |
| outScale | <code>Vector3f</code> | The scaling component will be written to this vector. |

<a name="Lore.Matrix4f+compose"></a>

#### matrix4f.compose(position, quaternion, scale) ⇒ <code>Matrix4f</code>
Composes the matrix from the positional, rotational and scaling components.

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector3f</code> | The positional component. |
| quaternion | <code>Quaternion</code> | The rotational component. |
| scale | <code>Vector3f</code> | The scaling component. |

<a name="Lore.Matrix4f+invert"></a>

#### matrix4f.invert() ⇒ <code>Matrix4f</code>
Inverts this matrix.

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - Returns itself.  
<a name="Lore.Matrix4f+clone"></a>

#### matrix4f.clone() ⇒ <code>Matrix4f</code>
Clones this matrix.

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - A clone of the matrix.  
<a name="Lore.Matrix4f+equals"></a>

#### matrix4f.equals(a) ⇒ <code>Boolean</code>
Checks whether or not the entries of the two matrices match.

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Boolean</code> - A boolean indicating whether or not the entries of the two matrices match.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Matrix4f</code> | A matrix. |

<a name="Lore.Matrix4f+toString"></a>

#### matrix4f.toString() ⇒ <code>String</code>
Returns a string representation of the matrix.

**Kind**: instance method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>String</code> - The string representation of this matrix.  
<a name="Lore.Matrix4f.multiply"></a>

#### Matrix4f.multiply(a, b) ⇒ <code>Matrix4f</code>
Multiply the two matrices (a * b).

**Kind**: static method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - A matrix.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>any</code> | A matrix to be multiplied. |
| b | <code>any</code> | A matrix to be multiplied. |

<a name="Lore.Matrix4f.fromQuaternion"></a>

#### Matrix4f.fromQuaternion(q) ⇒ <code>Matrix4f</code>
Initialize a matrix from a quaternion.

**Kind**: static method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - A matrix.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>Quaternion</code> | A quaternion. |

<a name="Lore.Matrix4f.lookAt"></a>

#### Matrix4f.lookAt(cameraPosition, target, up) ⇒ <code>Matrix4f</code>
Create a lookat matrix for a camera.

**Kind**: static method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - A matrix.  

| Param | Type | Description |
| --- | --- | --- |
| cameraPosition | <code>Vector3f</code> | The position of the camera. |
| target | <code>Vector3f</code> | The lookat (target) of the camera. |
| up | <code>Vector3f</code> | The up vector of the camera node. |

<a name="Lore.Matrix4f.compose"></a>

#### Matrix4f.compose(position, quaternion, scale) ⇒ <code>Matrix4f</code>
Composes a matrix from the positional, rotational and scaling components.

**Kind**: static method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: <code>Matrix4f</code> - A matrix.  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vector3f</code> | The positional component. |
| quaternion | <code>Quaternion</code> | The rotational component. |
| scale | <code>Vector3f</code> | The scaling component. |

<a name="Lore.Matrix4f.invert"></a>

#### Matrix4f.invert(matrix) ⇒
Inverts a matrix.

**Kind**: static method of <code>[Matrix4f](#Lore.Matrix4f)</code>  
**Returns**: The inverted matrix.  

| Param | Type | Description |
| --- | --- | --- |
| matrix | <code>Matrix4f</code> | A matrix to be inverted. |

<a name="Lore.Quaternion"></a>

### Lore.Quaternion
A class representing a quaternion.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| components | <code>Float32Array</code> | A typed array storing the components of this quaternion. |


* [.Quaternion](#Lore.Quaternion)
    * [new Lore.Quaternion(x, y, z, w)](#new_Lore.Quaternion_new)
    * _instance_
        * [.getX()](#Lore.Quaternion+getX) ⇒ <code>Number</code>
        * [.getY()](#Lore.Quaternion+getY) ⇒ <code>Number</code>
        * [.getZ()](#Lore.Quaternion+getZ) ⇒ <code>Number</code>
        * [.getW()](#Lore.Quaternion+getW) ⇒ <code>Number</code>
        * [.set(x, y, z, w)](#Lore.Quaternion+set) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.setX(x)](#Lore.Quaternion+setX) ⇒ <code>Quaternion</code>
        * [.setY(y)](#Lore.Quaternion+setY) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.setZ(z)](#Lore.Quaternion+setZ) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.setW(w)](#Lore.Quaternion+setW) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.setFromAxisAngle(axis, angle)](#Lore.Quaternion+setFromAxisAngle) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.setFromUnitVectors(from, to)](#Lore.Quaternion+setFromUnitVectors) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.lookAt(source, dest, up)](#Lore.Quaternion+lookAt) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.lengthSq()](#Lore.Quaternion+lengthSq) ⇒ <code>Number</code>
        * [.length()](#Lore.Quaternion+length) ⇒ <code>Number</code>
        * [.inverse()](#Lore.Quaternion+inverse) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.normalize()](#Lore.Quaternion+normalize) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.dot(q)](#Lore.Quaternion+dot) ⇒ <code>Number</code>
        * [.multiplyA(b)](#Lore.Quaternion+multiplyA) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.multiplyB(a)](#Lore.Quaternion+multiplyB) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.multiplyScalar(s)](#Lore.Quaternion+multiplyScalar) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.conjugate()](#Lore.Quaternion+conjugate) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.add(q)](#Lore.Quaternion+add) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.subtract(q)](#Lore.Quaternion+subtract) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.rotateX(angle)](#Lore.Quaternion+rotateX) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.rotateY(angle)](#Lore.Quaternion+rotateY) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.rotateZ(angle)](#Lore.Quaternion+rotateZ) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.toRotationMatrix()](#Lore.Quaternion+toRotationMatrix) ⇒ <code>[Matrix4f](#Lore.Matrix4f)</code>
        * [.setFromMatrix(m)](#Lore.Quaternion+setFromMatrix) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.clone()](#Lore.Quaternion+clone) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.equals(q)](#Lore.Quaternion+equals) ⇒ <code>Boolean</code>
        * [.toString()](#Lore.Quaternion+toString) ⇒ <code>String</code>
    * _static_
        * [.dot(q, p)](#Lore.Quaternion.dot) ⇒ <code>Number</code>
        * [.multiply(a, b)](#Lore.Quaternion.multiply) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.multiplyScalar(q, s)](#Lore.Quaternion.multiplyScalar) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.inverse(q)](#Lore.Quaternion.inverse) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.normalize(q)](#Lore.Quaternion.normalize) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.conjugate(q)](#Lore.Quaternion.conjugate) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.add(q, p)](#Lore.Quaternion.add) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.subtract(q, p)](#Lore.Quaternion.subtract) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.fromMatrix(m)](#Lore.Quaternion.fromMatrix) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
        * [.slerp(q, p, t)](#Lore.Quaternion.slerp) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>

<a name="new_Lore.Quaternion_new"></a>

#### new Lore.Quaternion(x, y, z, w)
Creates an instance of Quaternion.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x component of the quaternion. |
| y | <code>Number</code> | The y component of the quaternion. |
| z | <code>Number</code> | The z component of the quaternion. |
| w | <code>Number</code> | The w component of the quaternion. |

<a name="Lore.Quaternion+getX"></a>

#### quaternion.getX() ⇒ <code>Number</code>
Get the x component of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>Number</code> - The x component of this quaternion.  
<a name="Lore.Quaternion+getY"></a>

#### quaternion.getY() ⇒ <code>Number</code>
Get the y component of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>Number</code> - The y component of this quaternion.  
<a name="Lore.Quaternion+getZ"></a>

#### quaternion.getZ() ⇒ <code>Number</code>
Get the z component of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>Number</code> - The z component of this quaternion.  
<a name="Lore.Quaternion+getW"></a>

#### quaternion.getW() ⇒ <code>Number</code>
Get the w component of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>Number</code> - The w component of this quaternion.  
<a name="Lore.Quaternion+set"></a>

#### quaternion.set(x, y, z, w) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Set the components of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x component of this quaternion. |
| y | <code>Number</code> | The y component of this quaternion. |
| z | <code>Number</code> | The z component of this quaternion. |
| w | <code>Number</code> | The w component of this quaternion. |

<a name="Lore.Quaternion+setX"></a>

#### quaternion.setX(x) ⇒ <code>Quaternion</code>
Set the x component of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>Quaternion</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | The x component of this quaternion. |

<a name="Lore.Quaternion+setY"></a>

#### quaternion.setY(y) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Set the y component of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| y | <code>Number</code> | The y component of this quaternion. |

<a name="Lore.Quaternion+setZ"></a>

#### quaternion.setZ(z) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Set the z component of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| z | <code>Number</code> | The z component of this quaternion. |

<a name="Lore.Quaternion+setW"></a>

#### quaternion.setW(w) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Set the w component of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| w | <code>Number</code> | The w component of this quaternion. |

<a name="Lore.Quaternion+setFromAxisAngle"></a>

#### quaternion.setFromAxisAngle(axis, angle) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Sets the quaternion from the axis angle representation.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| axis | <code>[Vector3f](#Lore.Vector3f)</code> | The axis component. |
| angle | <code>Number</code> | The angle component. |

<a name="Lore.Quaternion+setFromUnitVectors"></a>

#### quaternion.setFromUnitVectors(from, to) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Sets the quaternion from unit vectors.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>[Vector3f](#Lore.Vector3f)</code> | The from vector. |
| to | <code>[Vector3f](#Lore.Vector3f)</code> | The to vector. |

<a name="Lore.Quaternion+lookAt"></a>

#### quaternion.lookAt(source, dest, up) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Set the quaternion based facing in a destionation direction.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>[Vector3f](#Lore.Vector3f)</code> | The source vector (the position). |
| dest | <code>[Vector3f](#Lore.Vector3f)</code> | The destination vector. |
| up | <code>[Vector3f](#Lore.Vector3f)</code> | The up vector of the source. |

<a name="Lore.Quaternion+lengthSq"></a>

#### quaternion.lengthSq() ⇒ <code>Number</code>
Get the square length of the quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>Number</code> - The square of the length.  
<a name="Lore.Quaternion+length"></a>

#### quaternion.length() ⇒ <code>Number</code>
Get the length of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>Number</code> - The length.  
<a name="Lore.Quaternion+inverse"></a>

#### quaternion.inverse() ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Get the inverse of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  
<a name="Lore.Quaternion+normalize"></a>

#### quaternion.normalize() ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Normalizes this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  
<a name="Lore.Quaternion+dot"></a>

#### quaternion.dot(q) ⇒ <code>Number</code>
Get the dot product of this and another quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>Number</code> - The dot product.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion+multiplyA"></a>

#### quaternion.multiplyA(b) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Multiply this quaternion with another (a * b).

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| b | <code>[Quaternion](#Lore.Quaternion)</code> | Another quaternion. |

<a name="Lore.Quaternion+multiplyB"></a>

#### quaternion.multiplyB(a) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Multiply another with this quaternion (a * b).

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>[Quaternion](#Lore.Quaternion)</code> | Another quaternion. |

<a name="Lore.Quaternion+multiplyScalar"></a>

#### quaternion.multiplyScalar(s) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Multiply this quaternion with a scalar.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>Number</code> | A scalar. |

<a name="Lore.Quaternion+conjugate"></a>

#### quaternion.conjugate() ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Conjugate (* -1) this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  
<a name="Lore.Quaternion+add"></a>

#### quaternion.add(q) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Add another quaternion to this one.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion+subtract"></a>

#### quaternion.subtract(q) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Subtract another quaternion from this one.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion+rotateX"></a>

#### quaternion.rotateX(angle) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Rotate this quaternion around the x axis.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| angle | <code>Number</code> | An angle in radians. |

<a name="Lore.Quaternion+rotateY"></a>

#### quaternion.rotateY(angle) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Rotate this quaternion around the y axis.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| angle | <code>Number</code> | An angle in radians. |

<a name="Lore.Quaternion+rotateZ"></a>

#### quaternion.rotateZ(angle) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Rotate this quaternion around the y axis.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| angle | <code>Number</code> | An angle in radians. |

<a name="Lore.Quaternion+toRotationMatrix"></a>

#### quaternion.toRotationMatrix() ⇒ <code>[Matrix4f](#Lore.Matrix4f)</code>
Create a rotation matrix from this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Matrix4f](#Lore.Matrix4f)</code> - A rotation matrix representation of this quaternion.  
<a name="Lore.Quaternion+setFromMatrix"></a>

#### quaternion.setFromMatrix(m) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Set this quaternion from a (rotation) matrix.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - Returns itself.  

| Param | Type |
| --- | --- |
| m | <code>[Matrix4f](#Lore.Matrix4f)</code> | 

<a name="Lore.Quaternion+clone"></a>

#### quaternion.clone() ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Clone this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - A clone of this quaternion.  
<a name="Lore.Quaternion+equals"></a>

#### quaternion.equals(q) ⇒ <code>Boolean</code>
Checks whether the entries of this quaternion match another one.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>Boolean</code> - A boolean representing whether the entries of the two quaternions match.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion+toString"></a>

#### quaternion.toString() ⇒ <code>String</code>
Returns a string representation of this quaternion.

**Kind**: instance method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>String</code> - A string representing this quaternion.  
<a name="Lore.Quaternion.dot"></a>

#### Quaternion.dot(q, p) ⇒ <code>Number</code>
Calculate the dot product of two quaternions.

**Kind**: static method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>Number</code> - The dot product.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |
| p | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion.multiply"></a>

#### Quaternion.multiply(a, b) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Multiply (cross product) two quaternions.

**Kind**: static method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - The cross product quaternion.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |
| b | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion.multiplyScalar"></a>

#### Quaternion.multiplyScalar(q, s) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Multiplies a quaternion with a scalar.

**Kind**: static method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - The resulting quaternion.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |
| s | <code>Number</code> | A scalar. |

<a name="Lore.Quaternion.inverse"></a>

#### Quaternion.inverse(q) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Inverse a quaternion.

**Kind**: static method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - The resulting quaternion.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion.normalize"></a>

#### Quaternion.normalize(q) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Normalize a quaternion.

**Kind**: static method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - The resulting quaternion.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion.conjugate"></a>

#### Quaternion.conjugate(q) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Conjugate (* -1) a quaternion.

**Kind**: static method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - The resulting quaternion.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion.add"></a>

#### Quaternion.add(q, p) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Sum two quaternions.

**Kind**: static method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - The resulting quaternion.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |
| p | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion.subtract"></a>

#### Quaternion.subtract(q, p) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Subtract a quaternion from another (q - p).

**Kind**: static method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - The resulting quaternion.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |
| p | <code>[Quaternion](#Lore.Quaternion)</code> | A quaternion. |

<a name="Lore.Quaternion.fromMatrix"></a>

#### Quaternion.fromMatrix(m) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Create a quaternion from a matrix.

**Kind**: static method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - The resulting quaternion.  

| Param | Type | Description |
| --- | --- | --- |
| m | <code>[Matrix4f](#Lore.Matrix4f)</code> | A matrix. |

<a name="Lore.Quaternion.slerp"></a>

#### Quaternion.slerp(q, p, t) ⇒ <code>[Quaternion](#Lore.Quaternion)</code>
Interpolate between two quaternions (t is between 0 and 1).

**Kind**: static method of <code>[Quaternion](#Lore.Quaternion)</code>  
**Returns**: <code>[Quaternion](#Lore.Quaternion)</code> - The resulting quaternion.  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>[Quaternion](#Lore.Quaternion)</code> | The source quaternion. |
| p | <code>[Quaternion](#Lore.Quaternion)</code> | The target quaternion. |
| t | <code>Number</code> | The interpolation value / percentage (between 0 an 1). |

<a name="Lore.SphericalCoords"></a>

### Lore.SphericalCoords
A class representing spherical coordinates.

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.SphericalCoords](#Lore.SphericalCoords)
    * [new Lore.SphericalCoords(radius, phi, theta)](#new_Lore.SphericalCoords_new)
    * [.set(radius, phi, theta)](#Lore.SphericalCoords+set) ⇒ <code>SphericalCoords</code>
    * [.secure()](#Lore.SphericalCoords+secure) ⇒ <code>SphericalCoords</code>
    * [.setFromVector(v)](#Lore.SphericalCoords+setFromVector) ⇒ <code>SphericalCoords</code>
    * [.limit(phiMin, phiMax, thetaMin, thetaMax)](#Lore.SphericalCoords+limit) ⇒ <code>SphericalCoords</code>
    * [.clone()](#Lore.SphericalCoords+clone) ⇒ <code>SphericalCoords</code>
    * [.toString()](#Lore.SphericalCoords+toString) ⇒ <code>String</code>

<a name="new_Lore.SphericalCoords_new"></a>

#### new Lore.SphericalCoords(radius, phi, theta)
Creates an instance of SphericalCoords.


| Param | Type | Description |
| --- | --- | --- |
| radius | <code>Number</code> | The radius. |
| phi | <code>Number</code> | Phi in radians. |
| theta | <code>Number</code> | Theta in radians. |

<a name="Lore.SphericalCoords+set"></a>

#### sphericalCoords.set(radius, phi, theta) ⇒ <code>SphericalCoords</code>
Set the spherical coordinates from the radius, the phi angle and the theta angle.

**Kind**: instance method of <code>[SphericalCoords](#Lore.SphericalCoords)</code>  
**Returns**: <code>SphericalCoords</code> - Returns itself.  

| Param | Type |
| --- | --- |
| radius | <code>Number</code> | 
| phi | <code>Number</code> | 
| theta | <code>Number</code> | 

<a name="Lore.SphericalCoords+secure"></a>

#### sphericalCoords.secure() ⇒ <code>SphericalCoords</code>
Avoid overflows.

**Kind**: instance method of <code>[SphericalCoords](#Lore.SphericalCoords)</code>  
**Returns**: <code>SphericalCoords</code> - Returns itself.  
<a name="Lore.SphericalCoords+setFromVector"></a>

#### sphericalCoords.setFromVector(v) ⇒ <code>SphericalCoords</code>
Set the spherical coordaintes from a vector.

**Kind**: instance method of <code>[SphericalCoords](#Lore.SphericalCoords)</code>  
**Returns**: <code>SphericalCoords</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>Vector3f</code> | A vector. |

<a name="Lore.SphericalCoords+limit"></a>

#### sphericalCoords.limit(phiMin, phiMax, thetaMin, thetaMax) ⇒ <code>SphericalCoords</code>
Limit the rotation by setting maxima and minima for phi and theta.

**Kind**: instance method of <code>[SphericalCoords](#Lore.SphericalCoords)</code>  
**Returns**: <code>SphericalCoords</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| phiMin | <code>Number</code> | The minimum for phi. |
| phiMax | <code>Number</code> | The maximum for phi. |
| thetaMin | <code>Number</code> | The minimum for theta. |
| thetaMax | <code>Number</code> | The maximum for theta. |

<a name="Lore.SphericalCoords+clone"></a>

#### sphericalCoords.clone() ⇒ <code>SphericalCoords</code>
Clone this spherical coordinates object.

**Kind**: instance method of <code>[SphericalCoords](#Lore.SphericalCoords)</code>  
**Returns**: <code>SphericalCoords</code> - A clone of the spherical coordinates object.  
<a name="Lore.SphericalCoords+toString"></a>

#### sphericalCoords.toString() ⇒ <code>String</code>
Returns a string representation of these spherical coordinates.

**Kind**: instance method of <code>[SphericalCoords](#Lore.SphericalCoords)</code>  
**Returns**: <code>String</code> - A string representing spherical coordinates.  
<a name="Lore.ProjectionMatrix"></a>

### Lore.ProjectionMatrix
A class representing a projection matrix

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.ProjectionMatrix](#Lore.ProjectionMatrix)
    * [.setOrthographic(left, right, top, bottom, near, far)](#Lore.ProjectionMatrix+setOrthographic) ⇒ <code>ProjectionMatrix</code>
    * [.setPerspective(fov, aspect, near, far)](#Lore.ProjectionMatrix+setPerspective) ⇒ <code>ProjectionMatrix</code>

<a name="Lore.ProjectionMatrix+setOrthographic"></a>

#### projectionMatrix.setOrthographic(left, right, top, bottom, near, far) ⇒ <code>ProjectionMatrix</code>
Set the projection matrix to an orthographic projection.

**Kind**: instance method of <code>[ProjectionMatrix](#Lore.ProjectionMatrix)</code>  
**Returns**: <code>ProjectionMatrix</code> - Returns this projection matrix.  

| Param | Type | Description |
| --- | --- | --- |
| left | <code>number</code> | The left edge. |
| right | <code>number</code> | The right edge. |
| top | <code>number</code> | The top edge. |
| bottom | <code>number</code> | The bottom edge. |
| near | <code>number</code> | The near-cutoff value. |
| far | <code>number</code> | The far-cutoff value. |

<a name="Lore.ProjectionMatrix+setPerspective"></a>

#### projectionMatrix.setPerspective(fov, aspect, near, far) ⇒ <code>ProjectionMatrix</code>
Set the projection matrix to a perspective projection.

**Kind**: instance method of <code>[ProjectionMatrix](#Lore.ProjectionMatrix)</code>  
**Returns**: <code>ProjectionMatrix</code> - Returns this projection matrix.  

| Param | Type | Description |
| --- | --- | --- |
| fov | <code>number</code> | The field of view. |
| aspect | <code>number</code> | The aspect ratio (width / height). |
| near | <code>number</code> | The near-cutoff value. |
| far | <code>number</code> | The far-cutoff value. |

<a name="Lore.Statistics"></a>

### Lore.Statistics
A helper class containing statistics methods.

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.Statistics](#Lore.Statistics)
    * [.randomNormal()](#Lore.Statistics.randomNormal) ⇒ <code>Number</code>
    * [.randomNormalInRange(a, b)](#Lore.Statistics.randomNormalInRange) ⇒ <code>Number</code>
    * [.randomNormalScaled(mean, sd)](#Lore.Statistics.randomNormalScaled) ⇒ <code>Number</code>
    * [.normalize(arr)](#Lore.Statistics.normalize) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.scale(value, oldMin, oldMax, newMin, newMax)](#Lore.Statistics.scale) ⇒ <code>Number</code>

<a name="Lore.Statistics.randomNormal"></a>

#### Statistics.randomNormal() ⇒ <code>Number</code>
Returns a normally distributed (pseudo) random number.

**Kind**: static method of <code>[Statistics](#Lore.Statistics)</code>  
**Returns**: <code>Number</code> - A normally distributed (pseudo) random number.  
<a name="Lore.Statistics.randomNormalInRange"></a>

#### Statistics.randomNormalInRange(a, b) ⇒ <code>Number</code>
Returns a normally distributed (pseudo) random number within a range.

**Kind**: static method of <code>[Statistics](#Lore.Statistics)</code>  
**Returns**: <code>Number</code> - A normally distributed (pseudo) random number within a range.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Number</code> | The start of the range. |
| b | <code>Number</code> | The end of the range. |

<a name="Lore.Statistics.randomNormalScaled"></a>

#### Statistics.randomNormalScaled(mean, sd) ⇒ <code>Number</code>
Returns a normally distributed (pseudo) random number around a mean with a standard deviation.

**Kind**: static method of <code>[Statistics](#Lore.Statistics)</code>  
**Returns**: <code>Number</code> - A normally distributed (pseudo) random number around a mean with a standard deviation.  

| Param | Type | Description |
| --- | --- | --- |
| mean | <code>Number</code> | The mean. |
| sd | <code>Number</code> | The standard deviation. |

<a name="Lore.Statistics.normalize"></a>

#### Statistics.normalize(arr) ⇒ <code>Array.&lt;Number&gt;</code>
Normalize / scale an array between 0 and 1.

**Kind**: static method of <code>[Statistics](#Lore.Statistics)</code>  
**Returns**: <code>Array.&lt;Number&gt;</code> - The normalized / scaled array.  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;Number&gt;</code> | An array. |

<a name="Lore.Statistics.scale"></a>

#### Statistics.scale(value, oldMin, oldMax, newMin, newMax) ⇒ <code>Number</code>
Scales a number to within a given scale.

**Kind**: static method of <code>[Statistics](#Lore.Statistics)</code>  
**Returns**: <code>Number</code> - The scaled number.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | The number. |
| oldMin | <code>Number</code> | The current minimum. |
| oldMax | <code>Number</code> | The current maximum. |
| newMin | <code>Number</code> | The cnew minimum. |
| newMax | <code>Number</code> | The new maximum. |

<a name="Lore.Ray"></a>

### Lore.Ray
A class representing a ray

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.Ray](#Lore.Ray)
    * [new Lore.Ray(source, direction)](#new_Lore.Ray_new)
    * [.copyFrom(r)](#Lore.Ray+copyFrom) ⇒ <code>Ray</code>
    * [.applyProjection(m)](#Lore.Ray+applyProjection) ⇒ <code>Ray</code>
    * [.distanceSqToPoint(v)](#Lore.Ray+distanceSqToPoint) ⇒ <code>Number</code>
    * [.closestPointToPoint(v)](#Lore.Ray+closestPointToPoint) ⇒ <code>Vector3f</code>

<a name="new_Lore.Ray_new"></a>

#### new Lore.Ray(source, direction)
Creates an instance of Ray.


| Param | Type | Description |
| --- | --- | --- |
| source | <code>Vector3f</code> | The source of the ray. |
| direction | <code>Vector3f</code> | The direction of the ray. |

<a name="Lore.Ray+copyFrom"></a>

#### ray.copyFrom(r) ⇒ <code>Ray</code>
Copy the values from another ray.

**Kind**: instance method of <code>[Ray](#Lore.Ray)</code>  
**Returns**: <code>Ray</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>Ray</code> | A ray. |

<a name="Lore.Ray+applyProjection"></a>

#### ray.applyProjection(m) ⇒ <code>Ray</code>
Apply a projection matrix to this ray.

**Kind**: instance method of <code>[Ray](#Lore.Ray)</code>  
**Returns**: <code>Ray</code> - Returns itself.  

| Param | Type | Description |
| --- | --- | --- |
| m | <code>Matrix4f</code> &#124; <code>ProjectionMatrix</code> | A matrix / projection matrix. |

<a name="Lore.Ray+distanceSqToPoint"></a>

#### ray.distanceSqToPoint(v) ⇒ <code>Number</code>
The square of the distance of a vector to this ray.

**Kind**: instance method of <code>[Ray](#Lore.Ray)</code>  
**Returns**: <code>Number</code> - The square pf the distance between the point and this ray.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>Vector3f</code> | A vector. |

<a name="Lore.Ray+closestPointToPoint"></a>

#### ray.closestPointToPoint(v) ⇒ <code>Vector3f</code>
Find a point on the ray that is closest to a supplied vector.

**Kind**: instance method of <code>[Ray](#Lore.Ray)</code>  
**Returns**: <code>Vector3f</code> - The cloest point on the ray to the supplied point.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>Vector3f</code> | A vector. |

<a name="Lore.RadixSort"></a>

### Lore.RadixSort
A class wrapping a radix sort for floats.

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.RadixSort](#Lore.RadixSort)
    * [new Lore.RadixSort()](#new_Lore.RadixSort_new)
    * [.sort(arr, [copyArray])](#Lore.RadixSort+sort) ⇒ <code>Object</code>
    * [.lsbPass(arr, aux)](#Lore.RadixSort+lsbPass)
    * [.pass(arr, aux)](#Lore.RadixSort+pass)
    * [.msbPass(arr, aux)](#Lore.RadixSort+msbPass)
    * [.initHistograms(arr, maxOffset, lastMask)](#Lore.RadixSort+initHistograms)

<a name="new_Lore.RadixSort_new"></a>

#### new Lore.RadixSort()
Creates an instance of RadixSort.

<a name="Lore.RadixSort+sort"></a>

#### radixSort.sort(arr, [copyArray]) ⇒ <code>Object</code>
Sorts a 32-bit float array using radix sort.

**Kind**: instance method of <code>[RadixSort](#Lore.RadixSort)</code>  
**Returns**: <code>Object</code> - The result in the form { array: sortedArray, indices: sortedIndices }.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | <code>Float32Array</code> |  | The array to be sorted. |
| [copyArray] | <code>Boolean</code> | <code>false</code> | A boolean indicating whether to perform the sorting directly on the array or copy it. |

<a name="Lore.RadixSort+lsbPass"></a>

#### radixSort.lsbPass(arr, aux)
The lsb (least significant bit) pass of the algorithm.

**Kind**: instance method of <code>[RadixSort](#Lore.RadixSort)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Float32Array</code> | The array. |
| aux | <code>Float32Array</code> | An auxilliary array. |

<a name="Lore.RadixSort+pass"></a>

#### radixSort.pass(arr, aux)
The main pass of the algorithm.

**Kind**: instance method of <code>[RadixSort](#Lore.RadixSort)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Float32Array</code> | The array. |
| aux | <code>Float32Array</code> | An auxilliary array. |

<a name="Lore.RadixSort+msbPass"></a>

#### radixSort.msbPass(arr, aux)
The msb (most significant bit) pass of the algorithm.

**Kind**: instance method of <code>[RadixSort](#Lore.RadixSort)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Float32Array</code> | The array. |
| aux | <code>Float32Array</code> | An auxilliary array. |

<a name="Lore.RadixSort+initHistograms"></a>

#### radixSort.initHistograms(arr, maxOffset, lastMask)
Initialize the histogram used by the algorithm.

**Kind**: instance method of <code>[RadixSort](#Lore.RadixSort)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Float32Array</code> | The array to be sorted. |
| maxOffset | <code>Number</code> | The maximum offset. |
| lastMask | <code>Number</code> | The last max, based on the msb (most significant bit) mask. |

<a name="Lore.HelperBase"></a>

### Lore.HelperBase
The base class for helper classes.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| renderer | <code>[Renderer](#Lore.Renderer)</code> | An instance of Lore.Renderer. |
| shader | <code>[Shader](#Lore.Shader)</code> | The shader associated with this helper. |
| geometry | <code>[Geometry](#Lore.Geometry)</code> | The geometry associated with this helper. |


* [.HelperBase](#Lore.HelperBase)
    * [new Lore.HelperBase(renderer, geometryName, shaderName)](#new_Lore.HelperBase_new)
    * [.setAttribute(name, data)](#Lore.HelperBase+setAttribute)
    * [.getAttribute(name)](#Lore.HelperBase+getAttribute) ⇒ <code>TypedArray</code>
    * [.updateAttribute(name, index, value)](#Lore.HelperBase+updateAttribute)
    * [.updateAttributeAll(name, values)](#Lore.HelperBase+updateAttributeAll)
    * [.draw()](#Lore.HelperBase+draw)
    * [.destruct()](#Lore.HelperBase+destruct)

<a name="new_Lore.HelperBase_new"></a>

#### new Lore.HelperBase(renderer, geometryName, shaderName)
Creates an instance of HelperBase.


| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>[Renderer](#Lore.Renderer)</code> | A Lore.Renderer object. |
| geometryName | <code>String</code> | The name of this geometry. |
| shaderName | <code>String</code> | The name of the shader used to render the geometry. |

<a name="Lore.HelperBase+setAttribute"></a>

#### helperBase.setAttribute(name, data)
Set the value (a typed array) of an attribute.

**Kind**: instance method of <code>[HelperBase](#Lore.HelperBase)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the attribute. |
| data | <code>TypedArray</code> | A typed array containing the attribute values. |

<a name="Lore.HelperBase+getAttribute"></a>

#### helperBase.getAttribute(name) ⇒ <code>TypedArray</code>
Get the value of an attribute (usually a typed array).

**Kind**: instance method of <code>[HelperBase](#Lore.HelperBase)</code>  
**Returns**: <code>TypedArray</code> - Usually, a typed array containing the attribute values.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the attribute. |

<a name="Lore.HelperBase+updateAttribute"></a>

#### helperBase.updateAttribute(name, index, value)
Update a the value of an attribute at a specific index and marks the attribute as stale.

**Kind**: instance method of <code>[HelperBase](#Lore.HelperBase)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the attribute. |
| index | <code>Number</code> | The index of the value to be updated. |
| value | <code>TypedArray</code> | Usually, a typed array or array with the length of the attribute values (3 for x, y, z coordinates) containing the new values. |

<a name="Lore.HelperBase+updateAttributeAll"></a>

#### helperBase.updateAttributeAll(name, values)
Updates all the values in the attribute and marks the attribute as stale.

**Kind**: instance method of <code>[HelperBase](#Lore.HelperBase)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the attribute. |
| values | <code>TypedArray</code> | A typed array containing the new attribute values. |

<a name="Lore.HelperBase+draw"></a>

#### helperBase.draw()
Calls the draw method of the underlying geometry.

**Kind**: instance method of <code>[HelperBase](#Lore.HelperBase)</code>  
<a name="Lore.HelperBase+destruct"></a>

#### helperBase.destruct()
Destructor for the helper (mainly used for OctreeHelpers to clean up events).

**Kind**: instance method of <code>[HelperBase](#Lore.HelperBase)</code>  
<a name="Lore.PointHelper"></a>

### Lore.PointHelper
A helper class wrapping a point cloud.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | An object containing options. |
| indices | <code>Array.&lt;Number&gt;</code> | Indices associated with the data. |
| octree | <code>[Octree](#Lore.Octree)</code> | The octree associated with the point cloud. |
| filters | <code>Object</code> | A map mapping filter names to Lore.Filter instances associated with this helper class. |
| pointSize | <code>Number</code> | The scaled and constrained point size of this data. |
| pointScale | <code>Number</code> | The scale of the point size. |
| rawPointSize | <code>Number</code> | The point size before scaling and constraints. |
| dimensions | <code>Object</code> | An object with the properties min and max, each a 3D vector containing the extremes. |


* [.PointHelper](#Lore.PointHelper)
    * [new Lore.PointHelper(renderer, geometryName, shaderName, options)](#new_Lore.PointHelper_new)
    * [.getMaxLength(x, y, z)](#Lore.PointHelper+getMaxLength) ⇒ <code>Number</code>
    * [.getDimensions()](#Lore.PointHelper+getDimensions) ⇒ <code>Object</code>
    * [.getCenter()](#Lore.PointHelper+getCenter) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
    * [.setPositions(positions)](#Lore.PointHelper+setPositions) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.setPositionsXYZ(x, y, z, length)](#Lore.PointHelper+setPositionsXYZ) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.setPositionsXYZHSS(x, y, z, hue, saturation, size)](#Lore.PointHelper+setPositionsXYZHSS) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.setRGB(r, g, b)](#Lore.PointHelper+setRGB) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.setColors(colors)](#Lore.PointHelper+setColors) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.updateColors(colors)](#Lore.PointHelper+updateColors) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.updateColor(index, color)](#Lore.PointHelper+updateColor) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.setPointSize(size)](#Lore.PointHelper+setPointSize) ⇒ <code>Number</code>
    * [.updatePointSize()](#Lore.PointHelper+updatePointSize)
    * [.getPointSize()](#Lore.PointHelper+getPointSize) ⇒ <code>Number</code>
    * [.getPointScale()](#Lore.PointHelper+getPointScale) ⇒ <code>Number</code>
    * [.setPointScale(pointScale)](#Lore.PointHelper+setPointScale) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.setFogDistance(fogStart, fogEnd)](#Lore.PointHelper+setFogDistance) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.initPointSize()](#Lore.PointHelper+initPointSize) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.getCutoff()](#Lore.PointHelper+getCutoff) ⇒ <code>Number</code>
    * [.setCutoff(cutoff)](#Lore.PointHelper+setCutoff) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.getHue(index)](#Lore.PointHelper+getHue) ⇒ <code>Number</code>
    * [.getSaturation(index)](#Lore.PointHelper+getSaturation) ⇒ <code>Number</code>
    * [.getSize(index)](#Lore.PointHelper+getSize) ⇒ <code>Number</code>
    * [.getPosition(index)](#Lore.PointHelper+getPosition) ⇒ <code>Number</code>
    * [.setHue(hue)](#Lore.PointHelper+setHue)
    * [.setSaturation(hue)](#Lore.PointHelper+setSaturation)
    * [.setSize(hue)](#Lore.PointHelper+setSize)
    * [.setHSS(hue, saturation, size, length)](#Lore.PointHelper+setHSS)
    * [.setHSSFromArrays(hue, saturation, size, length)](#Lore.PointHelper+setHSSFromArrays)
    * [.addFilter(name, filter)](#Lore.PointHelper+addFilter) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.removeFilter(name)](#Lore.PointHelper+removeFilter) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
    * [.getFilter(name)](#Lore.PointHelper+getFilter) ⇒ <code>[FilterBase](#Lore.FilterBase)</code>

<a name="new_Lore.PointHelper_new"></a>

#### new Lore.PointHelper(renderer, geometryName, shaderName, options)
Creates an instance of PointHelper.


| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>[Renderer](#Lore.Renderer)</code> | An instance of Lore.Renderer. |
| geometryName | <code>String</code> | The name of this geometry. |
| shaderName | <code>String</code> | The name of the shader used to render the geometry. |
| options | <code>Object</code> | An object containing options. |

<a name="Lore.PointHelper+getMaxLength"></a>

#### pointHelper.getMaxLength(x, y, z) ⇒ <code>Number</code>
Get the max length of the length of three arrays.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>Number</code> - The length of the largest array.  

| Param | Type |
| --- | --- |
| x | <code>Array</code> | 
| y | <code>Array</code> | 
| z | <code>Array</code> | 

<a name="Lore.PointHelper+getDimensions"></a>

#### pointHelper.getDimensions() ⇒ <code>Object</code>
Returns an object containing the dimensions of this point cloud.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>Object</code> - An object with the properties min and max, each a 3D vector containing the extremes.  
<a name="Lore.PointHelper+getCenter"></a>

#### pointHelper.getCenter() ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Get the center (average) of the point cloud.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The center (average) of the point cloud.  
<a name="Lore.PointHelper+setPositions"></a>

#### pointHelper.setPositions(positions) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Set the positions of points in this point cloud.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| positions | <code>TypedArray</code> | The positions (linear array). |

<a name="Lore.PointHelper+setPositionsXYZ"></a>

#### pointHelper.setPositionsXYZ(x, y, z, length) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Set the positions of points in this point clouds.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>TypedArray</code> | An array containing the x components. |
| y | <code>TypedArray</code> | An array containing the y components. |
| z | <code>TypedArray</code> | An array containing the z components. |
| length | <code>Number</code> | The length of the arrays. |

<a name="Lore.PointHelper+setPositionsXYZHSS"></a>

#### pointHelper.setPositionsXYZHSS(x, y, z, hue, saturation, size) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Set the positions and the HSS (Hue, Saturation, Size) values of the points in the point cloud.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>TypedArray</code> | An array containing the x components. |
| y | <code>TypedArray</code> | An array containing the y components. |
| z | <code>TypedArray</code> | An array containing the z components. |
| hue | <code>TypedArray</code> | An array containing the hues of the data points. |
| saturation | <code>TypedArray</code> | An array containing the saturations of the data points. |
| size | <code>TypedArray</code> | An array containing the sizes of the data points. |

<a name="Lore.PointHelper+setRGB"></a>

#### pointHelper.setRGB(r, g, b) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Set the hue from an rgb values.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>TypeArray</code> | An array containing the red components of the colors. |
| g | <code>TypeArray</code> | An array containing the green components of the colors. |
| b | <code>TypeArray</code> | An array containing the blue components of the colors. |

<a name="Lore.PointHelper+setColors"></a>

#### pointHelper.setColors(colors) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Set the colors (HSS) for the points.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| colors | <code>TypedArray</code> | An array containing the HSS values. |

<a name="Lore.PointHelper+updateColors"></a>

#### pointHelper.updateColors(colors) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Update the colors (HSS) for the points.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| colors | <code>TypedArray</code> | An array containing the HSS values. |

<a name="Lore.PointHelper+updateColor"></a>

#### pointHelper.updateColor(index, color) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Update the color (HSS) at a specific index.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index of the data point. |
| color | <code>[Color](#Lore.Color)</code> | An instance of Lore.Color containing HSS values. |

<a name="Lore.PointHelper+setPointSize"></a>

#### pointHelper.setPointSize(size) ⇒ <code>Number</code>
Set the global point size.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>Number</code> - The threshold for the raycaster.  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>Number</code> | The global point size. |

<a name="Lore.PointHelper+updatePointSize"></a>

#### pointHelper.updatePointSize()
Updates the displayed point size.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
<a name="Lore.PointHelper+getPointSize"></a>

#### pointHelper.getPointSize() ⇒ <code>Number</code>
Get the global point size.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>Number</code> - The global point size.  
<a name="Lore.PointHelper+getPointScale"></a>

#### pointHelper.getPointScale() ⇒ <code>Number</code>
Get the global point scale.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>Number</code> - The global point size.  
<a name="Lore.PointHelper+setPointScale"></a>

#### pointHelper.setPointScale(pointScale) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Sets the global point scale.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| pointScale | <code>Number</code> | The global point size. |

<a name="Lore.PointHelper+setFogDistance"></a>

#### pointHelper.setFogDistance(fogStart, fogEnd) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Sets the fog start and end distances, as seen from the camera.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| fogStart | <code>Number</code> | The start distance of the fog. |
| fogEnd | <code>Number</code> | The end distance of the fog. |

<a name="Lore.PointHelper+initPointSize"></a>

#### pointHelper.initPointSize() ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Initialize the point size based on the current zoom.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  
<a name="Lore.PointHelper+getCutoff"></a>

#### pointHelper.getCutoff() ⇒ <code>Number</code>
Get the current cutoff value.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>Number</code> - The current cutoff value.  
<a name="Lore.PointHelper+setCutoff"></a>

#### pointHelper.setCutoff(cutoff) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Set the cutoff value.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| cutoff | <code>Number</code> | A cutoff value. |

<a name="Lore.PointHelper+getHue"></a>

#### pointHelper.getHue(index) ⇒ <code>Number</code>
Get the hue for a given index.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>Number</code> - The hue of the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | An index. |

<a name="Lore.PointHelper+getSaturation"></a>

#### pointHelper.getSaturation(index) ⇒ <code>Number</code>
Get the saturation for a given index.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>Number</code> - The saturation of the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | An index. |

<a name="Lore.PointHelper+getSize"></a>

#### pointHelper.getSize(index) ⇒ <code>Number</code>
Get the size for a given index.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>Number</code> - The size of the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | An index. |

<a name="Lore.PointHelper+getPosition"></a>

#### pointHelper.getPosition(index) ⇒ <code>Number</code>
Get the position for a given index.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>Number</code> - The position of the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | An index. |

<a name="Lore.PointHelper+setHue"></a>

#### pointHelper.setHue(hue)
Set the hue. If a number is supplied, all the hues are set to the supplied number.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| hue | <code>TypedArray</code> &#124; <code>Number</code> | The hue to be set. If a number is supplied, all hues are set to its value. |

<a name="Lore.PointHelper+setSaturation"></a>

#### pointHelper.setSaturation(hue)
Set the saturation. If a number is supplied, all the saturations are set to the supplied number.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| hue | <code>TypedArray</code> &#124; <code>Number</code> | The saturation to be set. If a number is supplied, all saturations are set to its value. |

<a name="Lore.PointHelper+setSize"></a>

#### pointHelper.setSize(hue)
Set the size. If a number is supplied, all the sizes are set to the supplied number.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| hue | <code>TypedArray</code> &#124; <code>Number</code> | The size to be set. If a number is supplied, all sizes are set to its value. |

<a name="Lore.PointHelper+setHSS"></a>

#### pointHelper.setHSS(hue, saturation, size, length)
Set the HSS values. Sets all indices to the same values.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| hue | <code>Number</code> | A hue value. |
| saturation | <code>Number</code> | A saturation value. |
| size | <code>Number</code> | A size value. |
| length | <code>Number</code> | The length of the arrays. |

<a name="Lore.PointHelper+setHSSFromArrays"></a>

#### pointHelper.setHSSFromArrays(hue, saturation, size, length)
Set the HSS values.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| hue | <code>TypedArray</code> | An array of hue values. |
| saturation | <code>TypedArray</code> | An array of saturation values. |
| size | <code>TypedArray</code> | An array of size values. |
| length | <code>Number</code> | The length of the arrays. |

<a name="Lore.PointHelper+addFilter"></a>

#### pointHelper.addFilter(name, filter) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Add a filter to this point helper.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the filter. |
| filter | <code>[FilterBase](#Lore.FilterBase)</code> | A filter instance. |

<a name="Lore.PointHelper+removeFilter"></a>

#### pointHelper.removeFilter(name) ⇒ <code>[PointHelper](#Lore.PointHelper)</code>
Remove a filter by name.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[PointHelper](#Lore.PointHelper)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the filter to be removed. |

<a name="Lore.PointHelper+getFilter"></a>

#### pointHelper.getFilter(name) ⇒ <code>[FilterBase](#Lore.FilterBase)</code>
Get a filter by name.

**Kind**: instance method of <code>[PointHelper](#Lore.PointHelper)</code>  
**Returns**: <code>[FilterBase](#Lore.FilterBase)</code> - A filter instance.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of a filter. |

<a name="Lore.CoordinatesHelper"></a>

### Lore.CoordinatesHelper
A helper class for drawing coordinate system indicators. For example, a grid cube.

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.CoordinatesHelper](#Lore.CoordinatesHelper)
    * [new Lore.CoordinatesHelper(renderer, geometryName, shaderName, options)](#new_Lore.CoordinatesHelper_new)
    * [.init()](#Lore.CoordinatesHelper+init)

<a name="new_Lore.CoordinatesHelper_new"></a>

#### new Lore.CoordinatesHelper(renderer, geometryName, shaderName, options)
Creates an instance of CoordinatesHelper.


| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>[Renderer](#Lore.Renderer)</code> | A Lore.Renderer object. |
| geometryName | <code>string</code> | The name of this geometry. |
| shaderName | <code>string</code> | The name of the shader used to render the coordinates. |
| options | <code>object</code> | Options for drawing the coordinates. See documentation for details. |

<a name="Lore.CoordinatesHelper+init"></a>

#### coordinatesHelper.init()
Initializes the coordinates system.

**Kind**: instance method of <code>[CoordinatesHelper](#Lore.CoordinatesHelper)</code>  
<a name="Lore.OctreeHelper"></a>

### Lore.OctreeHelper
A helper class to create an octree associated with vertex data.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| opts | <code>\*</code> | An object containing options. |
| target | <code>[PointHelper](#Lore.PointHelper)</code> | The Lore.PointHelper object from which this octree is constructed. |
| renderer | <code>[Renderer](#Lore.Renderer)</code> | An instance of Lore.Renderer. |
| octree | <code>[Octree](#Lore.Octree)</code> | The octree associated with the target. |
| raycaster | <code>[Raycaster](#Lore.Raycaster)</code> | An instance of Lore.Raycaster. |
| hovered | <code>Object</code> | The currently hovered item. |
| selected | <code>Array.&lt;Object&gt;</code> | The currently selected items. |


* [.OctreeHelper](#Lore.OctreeHelper)
    * [new Lore.OctreeHelper(renderer, geometryName, shaderName, target, options)](#new_Lore.OctreeHelper_new)
    * [.init()](#Lore.OctreeHelper+init)
    * [.setPointSizeFromZoom(zoom)](#Lore.OctreeHelper+setPointSizeFromZoom)
    * [.getScreenPosition(index)](#Lore.OctreeHelper+getScreenPosition) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.addSelected(item)](#Lore.OctreeHelper+addSelected)
    * [.removeSelected(index)](#Lore.OctreeHelper+removeSelected)
    * [.clearSelected()](#Lore.OctreeHelper+clearSelected)
    * [.selectedContains(index)](#Lore.OctreeHelper+selectedContains) ⇒ <code>Boolean</code>
    * [.setHovered(index)](#Lore.OctreeHelper+setHovered)
    * [.selectHovered()](#Lore.OctreeHelper+selectHovered)
    * [.showCenters()](#Lore.OctreeHelper+showCenters)
    * [.showCubes()](#Lore.OctreeHelper+showCubes)
    * [.hide()](#Lore.OctreeHelper+hide)
    * [.getIntersections(mouse)](#Lore.OctreeHelper+getIntersections) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.addEventListener(eventName, callback)](#Lore.OctreeHelper+addEventListener)
    * [.raiseEvent(eventName, data)](#Lore.OctreeHelper+raiseEvent)
    * [.drawCenters()](#Lore.OctreeHelper+drawCenters)
    * [.drawBoxes()](#Lore.OctreeHelper+drawBoxes)
    * [.setThreshold(threshold)](#Lore.OctreeHelper+setThreshold)
    * [.rayIntersections(indices)](#Lore.OctreeHelper+rayIntersections) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.destruct()](#Lore.OctreeHelper+destruct)

<a name="new_Lore.OctreeHelper_new"></a>

#### new Lore.OctreeHelper(renderer, geometryName, shaderName, target, options)
Creates an instance of OctreeHelper.


| Param | Type | Description |
| --- | --- | --- |
| renderer | <code>[Renderer](#Lore.Renderer)</code> | A Lore.Renderer object. |
| geometryName | <code>String</code> | The name of this geometry. |
| shaderName | <code>String</code> | The name of the shader used to render this octree. |
| target | <code>[PointHelper](#Lore.PointHelper)</code> | The Lore.PointHelper object from which this octree is constructed. |
| options | <code>Object</code> | The options used to draw this octree. |

<a name="Lore.OctreeHelper+init"></a>

#### octreeHelper.init()
Initialize this octree.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
<a name="Lore.OctreeHelper+setPointSizeFromZoom"></a>

#### octreeHelper.setPointSizeFromZoom(zoom)
Sets the point size of the associated Lore.PointHelper object as well as the threshold for the associated raycaster used for vertex picking.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| zoom | <code>Number</code> | The current zoom value of the orthographic view. |

<a name="Lore.OctreeHelper+getScreenPosition"></a>

#### octreeHelper.getScreenPosition(index) ⇒ <code>Array.&lt;Number&gt;</code>
Get the screen position of a vertex by its index.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
**Returns**: <code>Array.&lt;Number&gt;</code> - An array containing the screen position. E.g. [122, 290].  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index of a vertex. |

<a name="Lore.OctreeHelper+addSelected"></a>

#### octreeHelper.addSelected(item)
Adds an object to the selected collection of this Lore.OctreeHelper object.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>Object</code> &#124; <code>Number</code> | Either an item (used internally) or the index of a vertex from the associated Lore.PointHelper object. |

<a name="Lore.OctreeHelper+removeSelected"></a>

#### octreeHelper.removeSelected(index)
Remove an item from the selected collection of this Lore.OctreeHelper object.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index of the item in the selected collection. |

<a name="Lore.OctreeHelper+clearSelected"></a>

#### octreeHelper.clearSelected()
Clear the selected collection of this Lore.OctreeHelper object.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
<a name="Lore.OctreeHelper+selectedContains"></a>

#### octreeHelper.selectedContains(index) ⇒ <code>Boolean</code>
Check whether or not the selected collection of this Lore.OctreeHelper object contains a vertex with a given index.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
**Returns**: <code>Boolean</code> - A boolean indicating whether or not the selected collection of this Lore.OctreeHelper contains a vertex with a given index.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index of a vertex in the associated Lore.PointHelper object. |

<a name="Lore.OctreeHelper+setHovered"></a>

#### octreeHelper.setHovered(index)
Adds a vertex with a given index to the currently hovered vertex of this Lore.OctreeHelper object.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | The index of a vertex in the associated Lore.PointHelper object. |

<a name="Lore.OctreeHelper+selectHovered"></a>

#### octreeHelper.selectHovered()
Add the currently hovered vertex to the collection of selected vertices.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
<a name="Lore.OctreeHelper+showCenters"></a>

#### octreeHelper.showCenters()
Show the centers of the axis-aligned bounding boxes of this octree.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
<a name="Lore.OctreeHelper+showCubes"></a>

#### octreeHelper.showCubes()
Show the axis-aligned boudning boxes of this octree as cubes.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
<a name="Lore.OctreeHelper+hide"></a>

#### octreeHelper.hide()
Hide the centers or cubes of the axis-aligned bounding boxes associated with this octree.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
<a name="Lore.OctreeHelper+getIntersections"></a>

#### octreeHelper.getIntersections(mouse) ⇒ <code>Array.&lt;Object&gt;</code>
Get the indices and distances of the vertices currently intersected by the ray sent from the mouse position.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
**Returns**: <code>Array.&lt;Object&gt;</code> - A distance-sorted (ASC) array containing the interesected vertices.  

| Param | Type | Description |
| --- | --- | --- |
| mouse | <code>Object</code> | A mouse object containing x and y properties. |

<a name="Lore.OctreeHelper+addEventListener"></a>

#### octreeHelper.addEventListener(eventName, callback)
Add an event listener to this Lore.OctreeHelper object.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | The name of the event to listen for. |
| callback | <code>function</code> | A callback function called when an event is fired. |

<a name="Lore.OctreeHelper+raiseEvent"></a>

#### octreeHelper.raiseEvent(eventName, data)
Raise an event with a given name and send the data to the functions listening for this event.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | The name of the event to be rised. |
| data | <code>\*</code> | Data to be sent to the listening functions. |

<a name="Lore.OctreeHelper+drawCenters"></a>

#### octreeHelper.drawCenters()
Draw the centers of the axis-aligned bounding boxes of this octree.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
<a name="Lore.OctreeHelper+drawBoxes"></a>

#### octreeHelper.drawBoxes()
Draw the axis-aligned bounding boxes of this octree.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
<a name="Lore.OctreeHelper+setThreshold"></a>

#### octreeHelper.setThreshold(threshold)
Set the threshold of the raycaster associated with this Lore.OctreeHelper object.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| threshold | <code>Number</code> | The threshold (maximum distance to the ray) of the raycaster. |

<a name="Lore.OctreeHelper+rayIntersections"></a>

#### octreeHelper.rayIntersections(indices) ⇒ <code>Array.&lt;Number&gt;</code>
Execute a ray intersection search within this octree.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
**Returns**: <code>Array.&lt;Number&gt;</code> - An array containing the vertices intersected by the ray.  

| Param | Type | Description |
| --- | --- | --- |
| indices | <code>Array.&lt;Number&gt;</code> | The indices of the octree nodes that are intersected by the ray. |

<a name="Lore.OctreeHelper+destruct"></a>

#### octreeHelper.destruct()
Remove eventhandlers from associated controls.

**Kind**: instance method of <code>[OctreeHelper](#Lore.OctreeHelper)</code>  
<a name="Lore.FilterBase"></a>

### Lore.FilterBase
An abstract class representing the base for filter implementations.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type name of this object (Lore.FilterBase). |
| geometry | <code>[Geometry](#Lore.Geometry)</code> | The Geometry associated with this filter. |
| attribute | <code>string</code> | The name of the attribute to filter on. |
| attributeIndex | <code>number</code> | The attribute-index to filter on. |
| active | <code>boolean</code> | Whether or not the filter is active. |


* [.FilterBase](#Lore.FilterBase)
    * [new Lore.FilterBase(attribute, attributeIndex)](#new_Lore.FilterBase_new)
    * _instance_
        * [.getGeometry()](#Lore.FilterBase+getGeometry) ⇒ <code>[Geometry](#Lore.Geometry)</code>
        * [.setGeometry(value)](#Lore.FilterBase+setGeometry)
        * [.filter()](#Lore.FilterBase+filter)
        * [.reset()](#Lore.FilterBase+reset)
    * _static_
        * [.isVisible(geometry, index)](#Lore.FilterBase.isVisible) ⇒ <code>boolean</code>

<a name="new_Lore.FilterBase_new"></a>

#### new Lore.FilterBase(attribute, attributeIndex)
Creates an instance of FilterBase.


| Param | Type | Description |
| --- | --- | --- |
| attribute | <code>string</code> | The name of the attribute to filter on. |
| attributeIndex | <code>name</code> | The attribute-index to filter on. |

<a name="Lore.FilterBase+getGeometry"></a>

#### filterBase.getGeometry() ⇒ <code>[Geometry](#Lore.Geometry)</code>
Returns the geometry associated with this filter.

**Kind**: instance method of <code>[FilterBase](#Lore.FilterBase)</code>  
**Returns**: <code>[Geometry](#Lore.Geometry)</code> - The geometry associated with this filter.  
<a name="Lore.FilterBase+setGeometry"></a>

#### filterBase.setGeometry(value)
Sets the geometry associated with this filter.

**Kind**: instance method of <code>[FilterBase](#Lore.FilterBase)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>[Geometry](#Lore.Geometry)</code> | The geometry to be associated with this filter. |

<a name="Lore.FilterBase+filter"></a>

#### filterBase.filter()
Abstract method.

**Kind**: instance method of <code>[FilterBase](#Lore.FilterBase)</code>  
<a name="Lore.FilterBase+reset"></a>

#### filterBase.reset()
Abstract method.

**Kind**: instance method of <code>[FilterBase](#Lore.FilterBase)</code>  
<a name="Lore.FilterBase.isVisible"></a>

#### FilterBase.isVisible(geometry, index) ⇒ <code>boolean</code>
Check whether or not a vertex with a given index is visible. A vertex is visible when its color attribute is > 0.0 at attribute-index 2 (the size in HSS).

**Kind**: static method of <code>[FilterBase](#Lore.FilterBase)</code>  
**Returns**: <code>boolean</code> - A boolean indicating whether or not the vertex specified by index is visible (HSS size > 0.0).  

| Param | Type | Description |
| --- | --- | --- |
| geometry | <code>[Geometry](#Lore.Geometry)</code> | A Lore.Geometry with a color attribute. |
| index | <code>number</code> | A vertex index. |

<a name="Lore.InRangeFilter"></a>

### Lore.InRangeFilter
A class representing an In-Range-Filter. It is used to filter a geometry based on a min and max value.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| min | <code>number</code> | The minimum value. |
| max | <code>number</code> | The maximum value. |


* [.InRangeFilter](#Lore.InRangeFilter)
    * [new Lore.InRangeFilter(attribute, attributeIndex, min, max)](#new_Lore.InRangeFilter_new)
    * [.getMin()](#Lore.InRangeFilter+getMin) ⇒ <code>number</code>
    * [.setMin(value)](#Lore.InRangeFilter+setMin)
    * [.getMax()](#Lore.InRangeFilter+getMax) ⇒ <code>number</code>
    * [.setMax(value)](#Lore.InRangeFilter+setMax)
    * [.filter()](#Lore.InRangeFilter+filter)
    * [.reset()](#Lore.InRangeFilter+reset)

<a name="new_Lore.InRangeFilter_new"></a>

#### new Lore.InRangeFilter(attribute, attributeIndex, min, max)
Creates an instance of InRangeFilter.


| Param | Type | Description |
| --- | --- | --- |
| attribute | <code>string</code> | The name of the attribute to filter on. |
| attributeIndex | <code>number</code> | The attribute-index to filter on. |
| min | <code>number</code> | The minum value. |
| max | <code>number</code> | The maximum value. |

<a name="Lore.InRangeFilter+getMin"></a>

#### inRangeFilter.getMin() ⇒ <code>number</code>
Get the minimum.

**Kind**: instance method of <code>[InRangeFilter](#Lore.InRangeFilter)</code>  
**Returns**: <code>number</code> - The minimum.  
<a name="Lore.InRangeFilter+setMin"></a>

#### inRangeFilter.setMin(value)
Set the minimum.

**Kind**: instance method of <code>[InRangeFilter](#Lore.InRangeFilter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The minimum. |

<a name="Lore.InRangeFilter+getMax"></a>

#### inRangeFilter.getMax() ⇒ <code>number</code>
Get the maximum.

**Kind**: instance method of <code>[InRangeFilter](#Lore.InRangeFilter)</code>  
**Returns**: <code>number</code> - The maximum.  
<a name="Lore.InRangeFilter+setMax"></a>

#### inRangeFilter.setMax(value)
Set the maximum.

**Kind**: instance method of <code>[InRangeFilter](#Lore.InRangeFilter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The maximum. |

<a name="Lore.InRangeFilter+filter"></a>

#### inRangeFilter.filter()
Execute the filter operation on the specified attribute and attribute-index. In order to filter, the HSS size value (attribute-index 2 of the color attribute) is set to its negative (1.0 -> -1.0, 2.5 -> -2.5).

**Kind**: instance method of <code>[InRangeFilter](#Lore.InRangeFilter)</code>  
<a name="Lore.InRangeFilter+reset"></a>

#### inRangeFilter.reset()
Resets the filter ("removes" it). The HSS size value is set back to its original value (-1.0 -> 1.0, -2.5 -> 2.5).

**Kind**: instance method of <code>[InRangeFilter](#Lore.InRangeFilter)</code>  
<a name="Lore.FileReaderBase"></a>

### Lore.FileReaderBase
An abstract class representing the base for file reader implementations.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| source | <code>String</code> | The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true. |


* [.FileReaderBase](#Lore.FileReaderBase)
    * [new Lore.FileReaderBase(source, [local])](#new_Lore.FileReaderBase_new)
    * [.addEventListener(eventName, callback)](#Lore.FileReaderBase+addEventListener)
    * [.raiseEvent(eventName, data)](#Lore.FileReaderBase+raiseEvent)
    * [.loaded(data)](#Lore.FileReaderBase+loaded)

<a name="new_Lore.FileReaderBase_new"></a>

#### new Lore.FileReaderBase(source, [local])
Creates an instance of FileReaderBase.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| source | <code>String</code> |  | The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true. |
| [local] | <code>Boolean</code> | <code>true</code> | A boolean indicating whether or not the source is local (a file input) or remote (a url). |

<a name="Lore.FileReaderBase+addEventListener"></a>

#### fileReaderBase.addEventListener(eventName, callback)
Add an event listener.

**Kind**: instance method of <code>[FileReaderBase](#Lore.FileReaderBase)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | The name of the event. |
| callback | <code>function</code> | A callback function associated with the event name. |

<a name="Lore.FileReaderBase+raiseEvent"></a>

#### fileReaderBase.raiseEvent(eventName, data)
Raise an event. To be called by inheriting classes.

**Kind**: instance method of <code>[FileReaderBase](#Lore.FileReaderBase)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | The name of the event. |
| data | <code>any</code> | Data to be passed to the handler. |

<a name="Lore.FileReaderBase+loaded"></a>

#### fileReaderBase.loaded(data)
To be overwritten by inheriting classes.

**Kind**: instance method of <code>[FileReaderBase](#Lore.FileReaderBase)</code>  

| Param | Type |
| --- | --- |
| data | <code>any</code> | 

<a name="Lore.CsvFileReader"></a>

### Lore.CsvFileReader
A class representing a CSV file reader.

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.CsvFileReader](#Lore.CsvFileReader)
    * [new Lore.CsvFileReader(source, options, [local])](#new_Lore.CsvFileReader_new)
    * [.loaded(data)](#Lore.CsvFileReader+loaded) ⇒ <code>[CsvFileReader](#Lore.CsvFileReader)</code>

<a name="new_Lore.CsvFileReader_new"></a>

#### new Lore.CsvFileReader(source, options, [local])
Creates an instance of CsvFileReader.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| source | <code>String</code> |  | The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true. |
| options | <code>any</code> |  | Options. See documentation for details. |
| [local] | <code>boolean</code> | <code>true</code> | A boolean indicating whether or not the source is local (a file input) or remote (a url). |

<a name="Lore.CsvFileReader+loaded"></a>

#### csvFileReader.loaded(data) ⇒ <code>[CsvFileReader](#Lore.CsvFileReader)</code>
Called when the data is loaded, will raise the "loaded" event.

**Kind**: instance method of <code>[CsvFileReader](#Lore.CsvFileReader)</code>  
**Returns**: <code>[CsvFileReader](#Lore.CsvFileReader)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>any</code> | The data loaded from the file or url. |

<a name="Lore.MatrixFileReader"></a>

### Lore.MatrixFileReader
A class representing a matrix file reader.

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.MatrixFileReader](#Lore.MatrixFileReader)
    * [new Lore.MatrixFileReader(source, options, [local])](#new_Lore.MatrixFileReader_new)
    * [.loaded(data)](#Lore.MatrixFileReader+loaded) ⇒ <code>[MatrixFileReader](#Lore.MatrixFileReader)</code>

<a name="new_Lore.MatrixFileReader_new"></a>

#### new Lore.MatrixFileReader(source, options, [local])
Creates an instance of MatrixFileReader.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| source | <code>String</code> |  | The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true. |
| options | <code>any</code> |  | Options. See documentation for details. |
| [local] | <code>boolean</code> | <code>true</code> | A boolean indicating whether or not the source is local (a file input) or remote (a url). |

<a name="Lore.MatrixFileReader+loaded"></a>

#### matrixFileReader.loaded(data) ⇒ <code>[MatrixFileReader](#Lore.MatrixFileReader)</code>
Called when the data is loaded, will raise the "loaded" event.

**Kind**: instance method of <code>[MatrixFileReader](#Lore.MatrixFileReader)</code>  
**Returns**: <code>[MatrixFileReader](#Lore.MatrixFileReader)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>any</code> | The data loaded from the file or url. |

<a name="Lore.Utils"></a>

### Lore.Utils
A utility class containing static methods.

**Kind**: static class of <code>[Lore](#Lore)</code>  

* [.Utils](#Lore.Utils)
    * [.extend()](#Lore.Utils.extend) ⇒ <code>object</code>
    * [.arrayContains(array, value)](#Lore.Utils.arrayContains) ⇒ <code>boolean</code>
    * [.concatTypedArrays(arrA, arrB)](#Lore.Utils.concatTypedArrays) ⇒ <code>TypedArray</code>
    * [.msb(n)](#Lore.Utils.msb) ⇒ <code>Number</code>
    * [.mergePointDistances(a, b)](#Lore.Utils.mergePointDistances) ⇒ <code>object</code>
    * [.isInt(n)](#Lore.Utils.isInt) ⇒
    * [.isFloat(n)](#Lore.Utils.isFloat) ⇒
    * [.jsonp(url, callback)](#Lore.Utils.jsonp)

<a name="Lore.Utils.extend"></a>

#### Utils.extend() ⇒ <code>object</code>
Merges two objects, overriding probierties set in both objects in the first one.

**Kind**: static method of <code>[Utils](#Lore.Utils)</code>  
**Returns**: <code>object</code> - The merged object.  
<a name="Lore.Utils.arrayContains"></a>

#### Utils.arrayContains(array, value) ⇒ <code>boolean</code>
Checks whether or not an array contains a given value.

**Kind**: static method of <code>[Utils](#Lore.Utils)</code>  
**Returns**: <code>boolean</code> - A boolean whether or not the array contains the value.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | An array. |
| value | <code>object</code> | An object. |

<a name="Lore.Utils.concatTypedArrays"></a>

#### Utils.concatTypedArrays(arrA, arrB) ⇒ <code>TypedArray</code>
Concatinate two typed arrays.

**Kind**: static method of <code>[Utils](#Lore.Utils)</code>  
**Returns**: <code>TypedArray</code> - The concatinated typed array.  

| Param | Type | Description |
| --- | --- | --- |
| arrA | <code>TypedArray</code> | A typed array. |
| arrB | <code>TypedArray</code> | A typed array. |

<a name="Lore.Utils.msb"></a>

#### Utils.msb(n) ⇒ <code>Number</code>
Get the most significant bit (MSB) of a number.

**Kind**: static method of <code>[Utils](#Lore.Utils)</code>  
**Returns**: <code>Number</code> - The most significant bit (0 or 1).  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>Number</code> | A number. |

<a name="Lore.Utils.mergePointDistances"></a>

#### Utils.mergePointDistances(a, b) ⇒ <code>object</code>
An utility method to merge two point distance objects containing arrays of indices and squared distances.

**Kind**: static method of <code>[Utils](#Lore.Utils)</code>  
**Returns**: <code>object</code> - The object with merged indices and squared distances.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>object</code> | An object in the form of { indices: TypedArray, distancesSq: TypedArray }. |
| b | <code>object</code> | An object in the form of { indices: TypedArray, distancesSq: TypedArray }. |

<a name="Lore.Utils.isInt"></a>

#### Utils.isInt(n) ⇒
Checks whether or not the number is an integer.

**Kind**: static method of <code>[Utils](#Lore.Utils)</code>  
**Returns**: A boolean whether or not the number is an integer.  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | A number. |

<a name="Lore.Utils.isFloat"></a>

#### Utils.isFloat(n) ⇒
Checks whether or not the number is a float.

**Kind**: static method of <code>[Utils](#Lore.Utils)</code>  
**Returns**: A boolean whether or not the number is a float.  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> | A number. |

<a name="Lore.Utils.jsonp"></a>

#### Utils.jsonp(url, callback)
A helper method enabling JSONP requests to an url.

**Kind**: static method of <code>[Utils](#Lore.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | An url. |
| callback | <code>function</code> | The callback to be called when the data is loaded. |

<a name="Lore.Octree"></a>

### Lore.Octree
An octree constructed using the point cloud.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| threshold | <code>number</code> | A threshold indicating whether or not a further subdivision is needed based on the number of data points in the current node. |
| maxDepth | <code>number</code> | A maximum depth of the octree. |
| points | <code>Object</code> | An object storing the points belonging to each node indexed by the location id of the node. |
| aabbs | <code>Object</code> | An object storing the axis-aligned bounding boxes belonging to each node indexed by the location id of the node. |


* [.Octree](#Lore.Octree)
    * [new Lore.Octree(threshold, maxDepth)](#new_Lore.Octree_new)
    * _instance_
        * [.build(pointIndices, vertices, aabb, locCode)](#Lore.Octree+build)
        * [.getLocCodes()](#Lore.Octree+getLocCodes)
        * [.getDepth(locCode)](#Lore.Octree+getDepth) ⇒ <code>number</code>
        * [.generateLocCode(The, The)](#Lore.Octree+generateLocCode) ⇒ <code>number</code>
        * [.traverse(traverseCallback, locCode)](#Lore.Octree+traverse)
        * [.traverseIf(traverseIfCallback, conditionCallback, locCode)](#Lore.Octree+traverseIf)
        * [.raySearch(raycaster)](#Lore.Octree+raySearch) ⇒ <code>Array</code>
        * [.getCenters()](#Lore.Octree+getCenters) ⇒ <code>Array</code>
        * [.getClosestBox(point, threshold, locCode)](#Lore.Octree+getClosestBox) ⇒ <code>[AABB](#Lore.AABB)</code>
        * [.getClosestBoxFromCenter(point, threshold, locCode)](#Lore.Octree+getClosestBoxFromCenter) ⇒ <code>[AABB](#Lore.AABB)</code>
        * [.getFarthestBox(point, threshold, locCode)](#Lore.Octree+getFarthestBox) ⇒ <code>[AABB](#Lore.AABB)</code>
        * [.getClosestPoint(point, positions, threshold, locCode)](#Lore.Octree+getClosestPoint) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.getFarthestPoint(point, positions, threshold, locCode)](#Lore.Octree+getFarthestPoint) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
        * [.getParent(locCode)](#Lore.Octree+getParent)
        * [.getNeighbours(locCode)](#Lore.Octree+getNeighbours) ⇒ <code>Array</code>
        * [.kNearestNeighbours(k, point, locCode, positions, kNNCallback)](#Lore.Octree+kNearestNeighbours)
        * [.getCellDistancesToPoint(x, y, z, locCode)](#Lore.Octree+getCellDistancesToPoint) ⇒ <code>Object</code>
        * [.expandNeighbourhood(x, y, z, locCode, cellDistances)](#Lore.Octree+expandNeighbourhood) ⇒ <code>number</code>
        * [.cellDistancesSq(x, y, z, locCode)](#Lore.Octree+cellDistancesSq) ⇒ <code>Object</code>
        * [.pointDistancesSq(x, y, z, locCode, positions)](#Lore.Octree+pointDistancesSq) ⇒ <code>Object</code>
    * _static_
        * [.concatTypedArrays(a, b)](#Lore.Octree.concatTypedArrays) ⇒ <code>Array</code>
        * [.mergePointDistances(a, b)](#Lore.Octree.mergePointDistances) ⇒ <code>Object</code>
        * [.mergeCellDistances(a, b)](#Lore.Octree.mergeCellDistances) ⇒ <code>Object</code>
        * [.clone(original)](#Lore.Octree.clone) ⇒ <code>[Octree](#Lore.Octree)</code>

<a name="new_Lore.Octree_new"></a>

#### new Lore.Octree(threshold, maxDepth)

| Param | Type | Description |
| --- | --- | --- |
| threshold | <code>number</code> | A threshold indicating whether or not a further subdivision is needed based on the number of data points in the current node. |
| maxDepth | <code>number</code> | A maximum depth of the octree. |

<a name="Lore.Octree+build"></a>

#### octree.build(pointIndices, vertices, aabb, locCode)
Builds the octree by assigning the indices of data points and axis-aligned bounding boxes to assoziative arrays indexed by the location code.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pointIndices | <code>Uint32Array</code> | An set of points that are either sub-divided into sub nodes or assigned to the current node. |
| vertices | <code>Float32Array</code> | An array containing the positions of all the vertices. |
| aabb | <code>PLOTTER.AABB</code> | The bounding box of the current node. |
| locCode | <code>number</code> | A binary code encoding the id and the level of the current node. |

<a name="Lore.Octree+getLocCodes"></a>

#### octree.getLocCodes()
Returns an array containing the location codes of all the axis-alignedbounding boxes inside this octree.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
<a name="Lore.Octree+getDepth"></a>

#### octree.getDepth(locCode) ⇒ <code>number</code>
Calculates the depth of the node from its location code.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>number</code> - The depth of the node with the provided location code.  

| Param | Type | Description |
| --- | --- | --- |
| locCode | <code>number</code> | A binary code encoding the id and the level of the current node. |

<a name="Lore.Octree+generateLocCode"></a>

#### octree.generateLocCode(The, The) ⇒ <code>number</code>
Generates a location code for a node based on the full code of the parent and the code of the current node.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>number</code> - The full location code for the current node.  

| Param | Type | Description |
| --- | --- | --- |
| The | <code>number</code> | full location code of the parent node. |
| The | <code>number</code> | 3 bit code of the current node. |

<a name="Lore.Octree+traverse"></a>

#### octree.traverse(traverseCallback, locCode)
Traverses the octree depth-first.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  

| Param | Type | Description |
| --- | --- | --- |
| traverseCallback | <code>[traverseCallback](#PLOTTER.Octree..traverseCallback)</code> | Is called for each node where a axis-aligned bounding box exists. |
| locCode | <code>number</code> | The location code of the node that serves as the starting node for the traversion. |

<a name="Lore.Octree+traverseIf"></a>

#### octree.traverseIf(traverseIfCallback, conditionCallback, locCode)
Traverses the octree depth-first, does not visit nodes / subtrees if a condition is not met.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  

| Param | Type | Description |
| --- | --- | --- |
| traverseIfCallback | <code>[traverseIfCallback](#PLOTTER.Octree..traverseIfCallback)</code> | Is called for each node where a axis-aligned bounding box exists and returns either true or false, with false stopping further exploration of the subtree. |
| conditionCallback | <code>[conditionCallback](#PLOTTER.Octree..conditionCallback)</code> | Is called to test whether or not a subtree should be explored. |
| locCode | <code>number</code> | The location code of the node that serves as the starting node for the traversion. |

<a name="Lore.Octree+raySearch"></a>

#### octree.raySearch(raycaster) ⇒ <code>Array</code>
Searches for octree nodes that are intersected by the ray and returns all the points associated with those nodes.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>Array</code> - A set of points which are associated with octree nodes intersected by the ray.  

| Param | Type | Description |
| --- | --- | --- |
| raycaster | <code>[Raycaster](#Lore.Raycaster)</code> | The raycaster used for checking for intersects. |

<a name="Lore.Octree+getCenters"></a>

#### octree.getCenters() ⇒ <code>Array</code>
Returns an array containing all the centers of the axis-aligned bounding boxesin this octree that have points associated with them.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>Array</code> - An array containing the centers as Lore.Vector3f objects.  
<a name="Lore.Octree+getClosestBox"></a>

#### octree.getClosestBox(point, threshold, locCode) ⇒ <code>[AABB](#Lore.AABB)</code>
This function returns the closest box in the octree to the point given as an argument.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>[AABB](#Lore.AABB)</code> - The closest axis-aligned bounding box to the input point.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>[Vector3f](#Lore.Vector3f)</code> | The point. |
| threshold | <code>number</code> | The minimum number of points an axis-aligned bounding box should contain to count as a hit. |
| locCode | <code>number</code> | The starting locCode, if not set, starts at the root. |

<a name="Lore.Octree+getClosestBoxFromCenter"></a>

#### octree.getClosestBoxFromCenter(point, threshold, locCode) ⇒ <code>[AABB](#Lore.AABB)</code>
This function returns the closest box in the octree to the point given as an argument. The distance measured is to thebox center.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>[AABB](#Lore.AABB)</code> - The closest axis-aligned bounding box to the input point.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>[Vector3f](#Lore.Vector3f)</code> | The point. |
| threshold | <code>number</code> | The minimum number of points an axis-aligned bounding box should contain to count as a hit. |
| locCode | <code>number</code> | The starting locCode, if not set, starts at the root. |

<a name="Lore.Octree+getFarthestBox"></a>

#### octree.getFarthestBox(point, threshold, locCode) ⇒ <code>[AABB](#Lore.AABB)</code>
This function returns the farthest box in the octree to the point given as an argument.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>[AABB](#Lore.AABB)</code> - The farthest axis-aligned bounding box to the input point.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>[Vector3f](#Lore.Vector3f)</code> | The point. |
| threshold | <code>number</code> | The minimum number of points an axis-aligned bounding box should contain to count as a hit. |
| locCode | <code>number</code> | The starting locCode, if not set, starts at the root. |

<a name="Lore.Octree+getClosestPoint"></a>

#### octree.getClosestPoint(point, positions, threshold, locCode) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Finds the closest point inside the octree to the point provided as an argument.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The position of the closest point.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>[Vector3f](#Lore.Vector3f)</code> | The point. |
| positions | <code>Float32Array</code> | An array containing the positions of the points. |
| threshold | <code>number</code> | Only consider points inside a axis-aligned bounding box with a minimum of [threshold] points. |
| locCode | <code>number</code> | If specified, the axis-aligned bounding box in which the point is searched for. If not set, all boxes are searched. |

<a name="Lore.Octree+getFarthestPoint"></a>

#### octree.getFarthestPoint(point, positions, threshold, locCode) ⇒ <code>[Vector3f](#Lore.Vector3f)</code>
Finds the farthest point inside the octree to the point provided as an argument.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>[Vector3f](#Lore.Vector3f)</code> - The position of the farthest point.  

| Param | Type | Description |
| --- | --- | --- |
| point | <code>[Vector3f](#Lore.Vector3f)</code> | The point. |
| positions | <code>Float32Array</code> | An array containing the positions of the points. |
| threshold | <code>number</code> | Only consider points inside a axis-aligned bounding box with a minimum of [threshold] points. |
| locCode | <code>number</code> | If specified, the axis-aligned bounding box in which the point is searched for. If not set, all boxes are searched. |

<a name="Lore.Octree+getParent"></a>

#### octree.getParent(locCode)
Returns the parent of a given location code by simply shifting it to the right by tree, removing the current code.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  

| Param | Type | Description |
| --- | --- | --- |
| locCode | <code>number</code> | The location code of a node. |

<a name="Lore.Octree+getNeighbours"></a>

#### octree.getNeighbours(locCode) ⇒ <code>Array</code>
Find neighbouring axis-aligned bounding boxes.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>Array</code> - An array of location codes of the neighbouring axis-aligned bounding boxes.  

| Param | Type | Description |
| --- | --- | --- |
| locCode | <code>number</code> | The location code of the axis-aligned bounding box whose neighbours will be returned |

<a name="Lore.Octree+kNearestNeighbours"></a>

#### octree.kNearestNeighbours(k, point, locCode, positions, kNNCallback)
Returns the k-nearest neighbours of a vertex.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  

| Param | Type | Description |
| --- | --- | --- |
| k | <code>number</code> | The number of nearest neighbours to return. |
| point | <code>number</code> | The index of a vertex or a vertex. |
| locCode | <code>number</code> | The location code of the axis-aligned bounding box containing the vertex. If not set, the box is searched for. |
| positions | <code>Float32Array</code> | The position information for the points indexed in this octree. |
| kNNCallback | <code>[kNNCallback](#PLOTTER.Plot..kNNCallback)</code> | The callback that is called after the k-nearest neighbour search has finished. |

<a name="Lore.Octree+getCellDistancesToPoint"></a>

#### octree.getCellDistancesToPoint(x, y, z, locCode) ⇒ <code>Object</code>
Calculates the distances from a given point to all of the cells containing points

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>Object</code> - An object containing arrays for the locCodes and the squred distances.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-value of the coordinate. |
| y | <code>number</code> | The y-value of the coordinate. |
| z | <code>number</code> | The z-value of the coordinate. |
| locCode | <code>number</code> | The location code of the cell containing the point. |

<a name="Lore.Octree+expandNeighbourhood"></a>

#### octree.expandNeighbourhood(x, y, z, locCode, cellDistances) ⇒ <code>number</code>
Expands the current neighbourhood around the cell where the point specified by x, y, z is in.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>number</code> - The number of added location codes.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-value of the coordinate. |
| y | <code>number</code> | The y-value of the coordinate. |
| z | <code>number</code> | The z-value of the coordinate. |
| locCode | <code>number</code> | The location code of the cell containing the point. |
| cellDistances | <code>Object</code> | The object containing location codes and distances. |

<a name="Lore.Octree+cellDistancesSq"></a>

#### octree.cellDistancesSq(x, y, z, locCode) ⇒ <code>Object</code>
Returns a list of the cells neighbouring the cell with the provided locCode and the point specified by x, y and z.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>Object</code> - An object containing arrays for the locCodes and the squred distances.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-value of the coordinate. |
| y | <code>number</code> | The y-value of the coordinate. |
| z | <code>number</code> | The z-value of the coordinate. |
| locCode | <code>number</code> | The number of the axis-aligned bounding box. |

<a name="Lore.Octree+pointDistancesSq"></a>

#### octree.pointDistancesSq(x, y, z, locCode, positions) ⇒ <code>Object</code>
Returns a list of the the squared distances of the points contained in the axis-aligned bounding box to the provided coordinates.

**Kind**: instance method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>Object</code> - An object containing arrays for the indices and distances.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x-value of the coordinate. |
| y | <code>number</code> | The y-value of the coordinate. |
| z | <code>number</code> | The z-value of the coordinate. |
| locCode | <code>number</code> | The number of the axis-aligned bounding box. |
| positions | <code>Float32Array</code> | The array containing the vertex coordinates. |

<a name="Lore.Octree.concatTypedArrays"></a>

#### Octree.concatTypedArrays(a, b) ⇒ <code>Array</code>
Concatenates the two typed arrays a and b and returns a new array. The two arrays have to be of the same type.Due to performance reasons, there is no check whether the types match.

**Kind**: static method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>Array</code> - The concatenated array.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Array</code> | The first array. |
| b | <code>Array</code> | The second array. |

<a name="Lore.Octree.mergePointDistances"></a>

#### Octree.mergePointDistances(a, b) ⇒ <code>Object</code>
Merges the two arrays (indices and distancesSq) in the point distances object.

**Kind**: static method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>Object</code> - The concatenated point distances object.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | The first point distances object. |
| b | <code>Object</code> | The second point distances object. |

<a name="Lore.Octree.mergeCellDistances"></a>

#### Octree.mergeCellDistances(a, b) ⇒ <code>Object</code>
Merges the two arrays (locCodes and distancesSq) in the cell distances object.

**Kind**: static method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>Object</code> - The concatenated cell distances object.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | The first cell distances object. |
| b | <code>Object</code> | The second cell distances object. |

<a name="Lore.Octree.clone"></a>

#### Octree.clone(original) ⇒ <code>[Octree](#Lore.Octree)</code>
Clones an octree.

**Kind**: static method of <code>[Octree](#Lore.Octree)</code>  
**Returns**: <code>[Octree](#Lore.Octree)</code> - The cloned octree.  

| Param | Type | Description |
| --- | --- | --- |
| original | <code>[Octree](#Lore.Octree)</code> | The octree to be cloned. |

<a name="Lore.AABB"></a>

### Lore.AABB
Axis-aligned bounding boxes with the constraint that they are cubes with equal sides.

**Kind**: static class of <code>[Lore](#Lore)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| center | <code>[Vector3f](#Lore.Vector3f)</code> | The center of this axis-aligned bounding box. |
| radius | <code>number</code> | The radius of this axis-aligned bounding box. |
| locCode | <code>number</code> | The location code of this axis-aligned bounding box in the octree. |
| left | <code>number</code> | The distance of the left plane to the world ZY plane. |
| right | <code>number</code> | The distance of the right plane to the world ZY plane. |
| back | <code>number</code> | The distance of the back plane to the world XY plane. |
| front | <code>number</code> | The distance of the front plane to the world XY plane. |
| bottom | <code>number</code> | The distance of the bottom plane to the world XZ plane. |
| top | <code>number</code> | The distance of the top plane to the world XZ plane. |
| neighbours | <code>Array</code> | The neighbours of this axis-aligned bounding box in an an octree. |
| min | <code>Float32Array</code> | An array specifying the minimum corner point (x, y, z) of the axis-aligned bounding box. |
| max | <code>Float32Array</code> | An array specifying the maximum corner point (x, y, z) of the axis-aligned bounding box. |


* [.AABB](#Lore.AABB)
    * [new Lore.AABB(center, radius)](#new_Lore.AABB_new)
    * _instance_
        * [.updateDimensions()](#Lore.AABB+updateDimensions)
        * [.setLocCode(locCode)](#Lore.AABB+setLocCode)
        * [.getLocCode()](#Lore.AABB+getLocCode) ⇒ <code>number</code>
        * [.rayTest(source, dir, dist)](#Lore.AABB+rayTest) ⇒ <code>boolean</code>
        * [.cylinderTest(source, dir, dist, radius)](#Lore.AABB+cylinderTest) ⇒ <code>boolean</code>
        * [.distanceToPointSq(x, y, z)](#Lore.AABB+distanceToPointSq) ⇒ <code>number</code>
        * [.distanceFromCenterToPointSq(x, y, z)](#Lore.AABB+distanceFromCenterToPointSq) ⇒ <code>number</code>
        * [.testAABB(aabb)](#Lore.AABB+testAABB) ⇒ <code>boolean</code>
    * _static_
        * [.fromPoints(vertices)](#Lore.AABB.fromPoints) ⇒ <code>[AABB](#Lore.AABB)</code>
        * [.getCorners(aabb)](#Lore.AABB.getCorners) ⇒ <code>Array</code>
        * [.clone(original)](#Lore.AABB.clone) ⇒ <code>[AABB](#Lore.AABB)</code>

<a name="new_Lore.AABB_new"></a>

#### new Lore.AABB(center, radius)

| Param | Type | Description |
| --- | --- | --- |
| center | <code>[Vector3f](#Lore.Vector3f)</code> | A radius for this axis-aligned bounding box. |
| radius | <code>number</code> | A radius for this axis-aligned bounding box. |

<a name="Lore.AABB+updateDimensions"></a>

#### aabB.updateDimensions()
Calculates the distance of the axis-aligned bounding box's planes to the world planes.

**Kind**: instance method of <code>[AABB](#Lore.AABB)</code>  
<a name="Lore.AABB+setLocCode"></a>

#### aabB.setLocCode(locCode)
Sets the location code of this axis-aligned bounding box.

**Kind**: instance method of <code>[AABB](#Lore.AABB)</code>  

| Param | Type | Description |
| --- | --- | --- |
| locCode | <code>number</code> | The location code. |

<a name="Lore.AABB+getLocCode"></a>

#### aabB.getLocCode() ⇒ <code>number</code>
Gets the location code of this axis-aligned bounding box.

**Kind**: instance method of <code>[AABB](#Lore.AABB)</code>  
**Returns**: <code>number</code> - The location code.  
<a name="Lore.AABB+rayTest"></a>

#### aabB.rayTest(source, dir, dist) ⇒ <code>boolean</code>
Tests whether or not this axis-aligned bounding box is intersected by a ray.

**Kind**: instance method of <code>[AABB](#Lore.AABB)</code>  
**Returns**: <code>boolean</code> - - Whether or not there is an intersect.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>[Vector3f](#Lore.Vector3f)</code> | The source of the ray. |
| dir | <code>[Vector3f](#Lore.Vector3f)</code> | A normalized vector of the direction of the ray. |
| dist | <code>number</code> | The maximum distance from the source that still counts as an intersect (the far property of the Lore.Raycaster object). |

<a name="Lore.AABB+cylinderTest"></a>

#### aabB.cylinderTest(source, dir, dist, radius) ⇒ <code>boolean</code>
Tests whether or not this axis-aligned bounding box is intersected by a cylinder. CAUTION: If this runs multi-threaded, it might fail.

**Kind**: instance method of <code>[AABB](#Lore.AABB)</code>  
**Returns**: <code>boolean</code> - - Whether or not there is an intersect.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>[Vector3f](#Lore.Vector3f)</code> | The source of the ray. |
| dir | <code>[Vector3f](#Lore.Vector3f)</code> | A normalized vector of the direction of the ray. |
| dist | <code>number</code> | The maximum distance from the source that still counts as an intersect (the far property of the Lore.Raycaster object). |
| radius | <code>number</code> | The radius of the cylinder |

<a name="Lore.AABB+distanceToPointSq"></a>

#### aabB.distanceToPointSq(x, y, z) ⇒ <code>number</code>
Returns the square distance of this axis-aligned bounding box to the point supplied as an argument.

**Kind**: instance method of <code>[AABB](#Lore.AABB)</code>  
**Returns**: <code>number</code> - The square distance of this axis-aligned bounding box to the input point.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x component of the point coordinate. |
| y | <code>number</code> | The y component of the point coordinate. |
| z | <code>number</code> | The z component of the point coordinate. |

<a name="Lore.AABB+distanceFromCenterToPointSq"></a>

#### aabB.distanceFromCenterToPointSq(x, y, z) ⇒ <code>number</code>
Returns the box that is closest to the point (measured from center).

**Kind**: instance method of <code>[AABB](#Lore.AABB)</code>  
**Returns**: <code>number</code> - The square distance of this axis-aligned bounding box to the input point.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The x component of the point coordinate. |
| y | <code>number</code> | The y component of the point coordinate. |
| z | <code>number</code> | The z component of the point coordinate. |

<a name="Lore.AABB+testAABB"></a>

#### aabB.testAABB(aabb) ⇒ <code>boolean</code>
Tests whether or not this axis-aligned bounding box overlaps or shares an edge or a vertex with another axis-aligned bounding box.This method can also be used to assert whether or not two boxes are neighbours.

**Kind**: instance method of <code>[AABB](#Lore.AABB)</code>  
**Returns**: <code>boolean</code> - - Whether or not there is an overlap.  

| Param | Type | Description |
| --- | --- | --- |
| aabb | <code>[AABB](#Lore.AABB)</code> | The axis-aligned bounding box to test against. |

<a name="Lore.AABB.fromPoints"></a>

#### AABB.fromPoints(vertices) ⇒ <code>[AABB](#Lore.AABB)</code>
Creates a axis-aligned bounding box surrounding a set of vertices.

**Kind**: static method of <code>[AABB](#Lore.AABB)</code>  
**Returns**: <code>[AABB](#Lore.AABB)</code> - An axis-aligned bounding box surrounding the vertices.  

| Param | Type | Description |
| --- | --- | --- |
| vertices | <code>Uint32Array</code> | The vertices which will all be inside the axis-aligned bounding box. |

<a name="Lore.AABB.getCorners"></a>

#### AABB.getCorners(aabb) ⇒ <code>Array</code>
Returns an array representing the 8 corners of the axis-aligned bounding box.

**Kind**: static method of <code>[AABB](#Lore.AABB)</code>  
**Returns**: <code>Array</code> - An array containing the 8 corners of the axisa-aligned bunding box. E.g [[x, y, z], [x, y, z], ...]  

| Param | Type | Description |
| --- | --- | --- |
| aabb | <code>[AABB](#Lore.AABB)</code> | An axis-aligned bounding box. |

<a name="Lore.AABB.clone"></a>

#### AABB.clone(original) ⇒ <code>[AABB](#Lore.AABB)</code>
Clones an axis-aligned bounding box.

**Kind**: static method of <code>[AABB](#Lore.AABB)</code>  
**Returns**: <code>[AABB](#Lore.AABB)</code> - The cloned axis-aligned bounding box.  

| Param | Type | Description |
| --- | --- | --- |
| original | <code>[AABB](#Lore.AABB)</code> | The axis-aligned bounding box to be cloned. |

<a name="Lore.Raycaster"></a>

### Lore.Raycaster
A class representing a raycaster.

**Kind**: static class of <code>[Lore](#Lore)</code>  
<a name="Lore.Raycaster+set"></a>

#### raycaster.set(camera, mouseX, mouseY) ⇒ <code>[Raycaster](#Lore.Raycaster)</code>
Set the raycaster based on a camera and the current mouse coordinates.

**Kind**: instance method of <code>[Raycaster](#Lore.Raycaster)</code>  
**Returns**: <code>[Raycaster](#Lore.Raycaster)</code> - Itself.  

| Param | Type | Description |
| --- | --- | --- |
| camera | <code>[CameraBase](#Lore.CameraBase)</code> | A camera object which extends Lore.CameraBase. |
| mouseX | <code>number</code> | The x coordinate of the mouse. |
| mouseY | <code>number</code> | The y coordinate of the mouse. |

<a name="Lore.DrawModes"></a>

### Lore.DrawModes
A map mapping draw modes as strings to their GLInt representations.

**Kind**: static property of <code>[Lore](#Lore)</code>  

* * *
