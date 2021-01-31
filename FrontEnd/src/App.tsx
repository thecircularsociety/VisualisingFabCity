import * as React from 'react';
import { ForceGraph3D, ForceGraph2D } from 'react-force-graph';
import SpriteText from 'three-spritetext';
import * as Immutable from 'immutable';

type Node = {
    id: number,
    name: string,
    value: number
}

type Link = {
    source: string,
    target: string
}

type Network = {
    nodes: Node[]
    links: Link[]
}

function App() {
    const emptyProperties: Immutable.Map<number, Node> = Immutable.Map();
    const emptyNetwork: Network = {
        nodes: [],
        links: []
    }

    var [network, setNetwork] = React.useState(emptyNetwork);
    var [properties, setProperties] = React.useState(emptyProperties);
    var [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        async function fetchNetworkData(): Promise<Network> {
            return await fetch("data.json").then((response) =>
                response.text().then(body => JSON.parse(body))
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

    return (!loaded) ? <div></div> : <ForceGraph3D graphData={network}
        nodeThreeObject={node => {
            const nodeName = properties.map(x => x.name).get(node.id as number, "");

            const sprite = new SpriteText(nodeName);
            return sprite;                
        }}  
    />;
}

export default App;
