import * as React from 'react';
import { ForceGraph2D } from 'react-force-graph';
import * as Immutable from 'immutable';
import { Neo4jProvider, createDriver, useReadCypher } from 'use-neo4j'
import Grid from '@mui/material/Grid';
import { Box, Container, ThemeProvider, Typography } from '@mui/material';
import './App.css'

type Node = {
    id: number,
    label: string
    properties: any
}

type Edge = {
    label: string
    source: number,
    target: number
}

type Graph = {
    nodes: Node[]
    links: Edge[]
}

function getColourFromLabel(label: string): string {
    switch (label) {
        case "Resource": return "#f72585"
        case "Organisation": return "#7209b7"
        case "Machine": return "#4cc9f0"
        case "Space": return "#4361ee"
        default: return "black"
    }
}

function GraphVisualiser() {
    const query = 'MATCH (n) OPTIONAL MATCH (n)-[r]->() RETURN n, labels(n), r';
    const { loading, records, error, result } = useReadCypher(query);

    const graph = Immutable.List(records ?? [])
        .reduce<Graph>(
            ({nodes, links}, record) => ({
                nodes: [{
                    id: record.get('n').identity.low,
                    label: record.get('n').labels[0],
                    properties: record.get('n').properties
                },...nodes],
                links: (record.has('r') && record.get('r') !== null)
                    ? [{
                        source: record.get('r').start.low,
                        target: record.get('r').end.low,
                        label: record.get('r').type
                    }, ...links] : links
            }),
            {nodes:[],links:[]}
        )

    if (!loading) {
        if (error !== undefined) {
            console.log(error.name + ': ' + error.message)
        } else {
            console.log(JSON.stringify(graph));
        }
    }

    return loading
        ? <div>Loading</div>
        : <ForceGraph2D
            graphData={graph}
            width={1300}
            height={900}
            linkWidth={2}
            backgroundColor="#ffffff"
            nodeLabel={graphNode => {
                const node = graphNode as Node;
                return node.label;
            }}
            linkLabel={graphLink => {
                const link = graphLink as Edge;
                return link.label;
            }}
            nodeCanvasObject={(graphNode, ctx) => {
                const node = graphNode as Node;
                const x = graphNode.x as number;
                const y = graphNode.y as number;

                ctx.fillStyle = getColourFromLabel(node.label);
                ctx.font = '6px Sans-Serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.beginPath();
                ctx.ellipse(x, y, 4.8, 4.8, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillText(node.properties.name ?? 'unknown', x, y - 10);
            }}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
        />
}

function App() {

    const driver = createDriver(
        'bolt',
        '81.153.7.60',
        7687,
        //'neo4j',
        //'tgb7xbp.pxn0azt6XRJ'
    )
    return (
        <Box className='box'>
            <Typography variant='h3'>Beth Holmes 2021</Typography>
            <Neo4jProvider driver={driver}>
                <GraphVisualiser/>
            </Neo4jProvider>
        </Box>
    );
}

export default App;

/*

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
    dataSource: "data.json",
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

*/
