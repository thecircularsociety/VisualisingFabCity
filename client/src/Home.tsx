import Box from '@mui/material/Box';
import './Home.css';
import { ForceGraph2D } from 'react-force-graph';
import { SizeMe } from 'react-sizeme';
import { useEffect, useState } from 'react';

type Node = {
    id: number,
    label: string,
    name: string
}

type Edge = {
    label: Label
    source: number,
    target: number
}

type Graph = {
    nodes: Node[]
    links: Edge[]
}

enum Label {
    Resource = 'Resource',
    Business = 'Business',
    Space = 'Space',
}

type GraphDiagramProps = {
    graph: Graph
}

function Home() {
    return <Box className={'vbox'}>
        <Navbar/>
        <Header/>
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
        </Box>
        <Box width={'30%'} className={'content_right vbox'}>
        </Box>
    </Box>
}

function Footer() {
    return <Box height={'100vh'} className={'footer vbox'}>
    </Box>
}

function getColorFromLabel(label: string) {
    switch (label) {
        case 'Space':
            return '#4287f5';
        case 'Business':
            return '#aa42f5';
        case 'Resource':
            return '#f5c542';
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
