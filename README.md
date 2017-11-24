![Lore](https://github.com/reymond-group/lore/blob/master/logo.png?raw=true)
# Lore
Current Version: 1.0.0 ([Starbreaker](https://www.youtube.com/watch?v=nr8pgN195Zw))

### Teasers
![](http://doc.gdb.tools/fun/img/lore_faerun.gif)
Browsing the SureChEMBL database (containing > 12 million datapoints): [Faerun](http://faerun.gdb.tools).

See the examples folder for more details.

### Building Lore
If you decide not to use the ready-to-go scripts in `dist`, you can (edit and) build the project by running:
```bash
npm install
gulp
```

### Getting Started
A simple example can be found in the `example` folder. The [example data file](https://github.com/reymond-group/lore/blob/master/example/v5_s10544-17fe05-03.pce) was downloaded from the [website](http://bdtnp.lbl.gov/Fly-Net/) of the Berkeley Drosophila Transcription Network Project. It is a very small data set (N=6000) chosen because of the small file size (larger files can not be hosted on github).

### Options
#### Renderer
| Option | Identifier | Data Type | Default Value |
|---|---|---|---|
| Antialiasing | antialiasing | boolean | true |
| Verbose Mode | verbose | boolean | false |
| The HTML element where FPS info is displayed | fpsElement | HTMLElement | document.getElementById('fps') |
| The canvas background color | clearColor | Lore.Color | Lore.Color.fromHex('#000000') |
| The distance of the camera to the center | radius | number | 500 |
| Clear Depth | clearDepth | number | 1.0 |
| Center (LookAt) | center | Lore.Vector3f | new Lore.Vector3f() |
| Enable depth test | enableDepthTest | boolean | true |

#### CoordinatesHelper
The options for the coordinate helper are self-explanatory:
```javascript
{
    position: new Lore.Vector3f(),
    axis: {
        x: {
            length: 50.0,
            color: Lore.Color.fromHex('#222222')
        },
        y: {
            length: 50.0,
            color: Lore.Color.fromHex('#222222')
        },
        z: {
            length: 50.0,
            color: Lore.Color.fromHex('#222222')
        }
    },
    ticks: {
        enabled: true,
        x: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: Lore.Color.fromHex('#1f1f1f')
        },
        y: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: Lore.Color.fromHex('#1f1f1f')
        },
        z: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: Lore.Color.fromHex('#1f1f1f')
        }
    },
    box: {
        enabled: true,
        x: {
            color: Lore.Color.fromHex('#222222')
        },
        y: {
            color: Lore.Color.fromHex('#222222')
        },
        z: {
            color: Lore.Color.fromHex('#222222')
        }
    },
}
```

#### OctreeHelper
| Option | Identifier | Data Type | Default Value |
|---|---|---|---|
| Visualize the octree (for debug purposes) | visualize | boolean or string | false, 'centers', 'cubes' |
| Enable multiselect | multiSelect | boolean | true |

#### PointHelper
| Option | Identifier | Data Type | Default Value |
|---|---|---|---|
| Create an octree when setting positions | octree | boolean | true |
| The maximum number of vertices in a octree node | octreeThreshold | number | 500 |
| The maximum depth of the octree | octreeMaxDepth | number | 8 |
| Point size scaling | pointScale | number | 1.0 |
| The maximum point size | maxPointSize | number | 100.0 |

### [Documentation](/doc/all.md)
The documentation can be found in the docs folder. A markdown version is available [here](/doc/all.md).
