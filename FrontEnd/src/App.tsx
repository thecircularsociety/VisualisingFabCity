import * as React from 'react';
import { ForceGraph3D, ForceGraph2D } from 'react-force-graph';
import SpriteText from 'three-spritetext';
import * as Immutable from 'immutable';
import { Object3D, Sprite, TextGeometry } from 'three';
import * as THREE from 'three';

type Node = {
    id: number,
    name: string,
    type: string
}

type Link = {
    source: string,
    target: string
}

type Network = {
    nodes: Node[]
    links: Link[]
}

function getColourFromType(type: string): string {
    switch (type) {
        case "Education": return "#f72585"
        case "Business": return "#7209b7"
        case "Partnership": return "#3a0ca3"
        case "Project": return "#4361ee"
        case "Resource": return "#4cc9f0"
        default: return "black"
    }
}

function App() {
    const emptyProperties: Immutable.Map<number, Node> = Immutable.Map();
    const emptyNetwork: Network = {
        nodes: [],
        links: []
    }
    const emptyNode: Node =
    {
        id: -1,
        name: "",
        type: ""
    }

    function getColourFromId(id: number): string {
        const type = properties.map(x => x.type).get(id, "");
        return getColourFromType(type);
    }

    var [network, setNetwork] = React.useState(emptyNetwork);
    var [properties, setProperties] = React.useState(emptyProperties);
    var [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        async function fetchNetworkData(): Promise<Network> {
            return await fetch("data.json").then((response) => {

                var result = response.text().then(body => JSON.parse(body))
                //console.log(result);
                return result;
            }

            )
        }

        fetchNetworkData().then(networkData => {
            setNetwork(networkData);
            networkData.nodes.map(node => {
                setProperties(currentProperties => {

                    return currentProperties.set(node.id, node)
                })
            })
            setLoaded(l => true);
        })
    }, []);

    return (!loaded) ? <div></div> : <ForceGraph2D graphData={network}
        linkWidth={2}
        backgroundColor="#e7ecef"
        nodeLabel={graphNode => {
            const node = properties.get(graphNode.id as number, emptyNode);
            return node.type;
        }}
        nodeCanvasObject={({ id, x, y }, ctx) => {
            const node = properties.get(id as number, emptyNode);
            ctx.fillStyle = getColourFromType(node.type);
            ctx.font = '10px Sans-Serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(node.name, x, y);
        }}

        //nodeThreeObject={graphNode => {
        //    const node = properties.get(graphNode.id as number, emptyNode);
        //    const colour = getColourFromType(node.type);
        //    const sprite = new SpriteText(node.name, 10, colour);
        //    sprite.fontFace = "Arial"
        //    sprite.fontWeight = "bold"
        //    return sprite;
        //}} 

    />;
}

export default App;
