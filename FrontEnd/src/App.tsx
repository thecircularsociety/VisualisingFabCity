import * as React from 'react';
import { ForceGraph2D } from 'react-force-graph';
import * as Immutable from 'immutable';
import Dropdown from 'react-dropdown';

const emptyProperties: Immutable.Map<number, Node> = Immutable.Map();
const emptyNetwork: Network = {
    nodes: [],
    links: []
}

const emptyNode: Node = {
    id: -1,
    name: "",
    type: ""
}

const emptyGraphProps: NetworkGraphProps = {
    dataSource: "FabCity.json",
    getColourFromCategory: getColourFromFabCityCategory
}

const options = [
    {
        value: 'FabCity',
        label: 'Fab City'
    },
    {
        value: 'Waste',
        label: 'Waste'
    }
]

type NetworkGraphProps = {
    dataSource: string,
    getColourFromCategory: (category: string) => string
}

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

function NetworkGraph(props: NetworkGraphProps) {
    var [network, setNetwork] = React.useState(emptyNetwork);
    var [properties, setProperties] = React.useState(emptyProperties);
    var [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        async function fetchNetworkData(): Promise<Network> {
            return await fetch(props.dataSource).then((response) => {
                return response.text().then(body => JSON.parse(body))
            })
        }

        fetchNetworkData().then(networkData => {
            setNetwork(networkData);
            networkData.nodes.forEach(node => {
                setProperties(currentProperties => {
                    return currentProperties.set(node.id, node)
                })
            })
            setLoaded(l => true);
        })
    }, [props.dataSource]);

    if (loaded) {
        return <ForceGraph2D graphData={network}
            linkWidth={2}
            backgroundColor="#FFFFFF"
            nodeLabel={graphNode => {
                const node = properties.get(graphNode.id as number, emptyNode);
                return node.type;
            }}
            nodeCanvasObject={({ id, x, y }, ctx) => {
                const node = properties.get(id as number, emptyNode);
                ctx.fillStyle = props.getColourFromCategory(node.type);
                ctx.font = '10px Sans-Serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(node.name, x as number, y as number);
            }}
        />
    }
    else {
        return <div></div>
    }
}

function getColourFromFabCityCategory(category: string): string {
    switch (category) {
        case "Education": return "#f72585"
        case "Business": return "#7209b7"
        case "Partnership": return "#3a0ca3"
        case "Project": return "#4361ee"
        case "Resource": return "#4cc9f0"
        default: return "black"
    }
}

function getColourFromWasteCategory(category: string): string {
    return "Fill me in";
}

function getPropsFromName(name: string): NetworkGraphProps {
    switch (name) {
        case "FabCity": return {
            dataSource: 'FabCity.json',
            getColourFromCategory: getColourFromFabCityCategory
        }
        case "Waste": return {
            dataSource: 'Waste.json',
            getColourFromCategory: getColourFromWasteCategory
        }
        default: return emptyGraphProps;
    }
}

function App() {
    var [graphProps, setGraphProps] = React.useState(emptyGraphProps);

    return (
        <div>
            <Dropdown
                options={options}
                onChange={x => {
                    setGraphProps(getPropsFromName(x.value))
                }}
                value={options[0]}
            />
            <NetworkGraph
                dataSource={graphProps.dataSource}
                getColourFromCategory={graphProps.getColourFromCategory}
            />
        </div>
    )
}

export default App;
