import Box from '@mui/material/Box';
import './Home.css';
import { ForceGraph2D } from 'react-force-graph';
import { SizeMe } from 'react-sizeme';
import { useEffect, useState } from 'react';

type Node = {
    id: string,
    label: string,
    name: string
}

type Edge = {
    label: Label
    source: string,
    target: string
}

type Graph = {
    nodes: Node[]
    links: Edge[]
}

enum Label {
    Resource = 'Resource',
    Business = 'Business',
    Space = 'Space',
    Machine = 'Machine'
}

type GraphDiagramProps = {
    graph: Graph
}

function Home() {
    return <Box className={'vbox'}>
        <Header/>
        <Paragraph/>
        <Content/>
        <Footer/>
    </Box>;
}

function Navbar() {
    return <Box height={60} className={'navbar sticky padded vbox'}>
    </Box>;
}

function Header() {
    return <Box height={150} className={'header padded vbox'}>
    Modelling Fab City Plymouth as a Graph
    </Box>;
}

function Paragraph() {
    return <Box height={150} className={'paragraph padded vbox'}>
    Plymouth is a Fab City at the beginning of its journey towards producing most of what it
consumes by 2054. To reach this goal, many individuals and organisations will need to
collaborate effectively to co-design - and locally produce - solutions whilst exchanging
knowledge with the 38 other cities also working towards this goal. An open source tool built from graph technologies could enable the identification of potential collaborations and
exchanges of materials, products and services by local citizens and organisations. A prototype visualisation of the graph structure can be seen and interacted with below.
    </Box>;
}

function Content() {
    const [graph, setGraph] = useState<Graph>({nodes:[],links:[]})

    useEffect(() => {
        fetch("data.json")
          .then((res) => res.json())
          .then(setGraph)
      }, []);

    return <Box height={600} className={'content hbox'}>
        <Box width={'30%'} className={'content_left vbox'}>
        </Box>
        <Box className={'main_content vbox'}>
            <GraphDiagram graph={graph}/>
            console.log(graph)
        </Box>
        <Box width={'30%'} className={'content_right vbox'}>
        </Box>
    </Box>
}

function Footer() {
    return <Box height={'100vh'} className={'footer vbox'}>
    </Box>
}

// Can change this to Label enum!
function getColorFromLabel(label: string) {
    switch (label) {
        case 'Space':
            return '#4287f5';
        case 'Organisation':
            return '#aa42f5';
        case 'Resource':
            return '#f5c542';
        case 'Machine':
            return 'aquamarine'
        default:
            return '#dddddd';
    }
}

function GraphDiagram(props: GraphDiagramProps) {
    return <SizeMe monitorHeight={true} >{({ size }) => <ForceGraph2D
        width={size.width ?? 300}
        height={size.height ?? 300}
        graphData={props.graph}
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

            ctx.fillStyle = getColorFromLabel(node.label);
            ctx.font = '6px Sans-Serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.beginPath();
            ctx.ellipse(x, y, 4.8, 4.8, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillText(node.name, x, y - 10);
        }}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
    />}</SizeMe>;
}

export default Home;
