import { useEffect, useRef } from "react"
import * as d3 from "d3";

let global_altScale: any;
const tickSizeValue: number = 500;

function loadLeftAxis(containerRef: any, svgRef: any, altScale: any){
    const margin = { top: 10, right: 10, bottom: 10, left: 30 };
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('width', '100%')
        .attr('height', '100%');

    svg.select('.alt-axis').remove();

    // Create the axis
    const altAxis = d3.axisLeft(altScale)
    .tickValues(d3.range(0, 1001, 50))
    .tickSize(tickSizeValue);

    // Append the axis to the g group
    svg.append('g')
        .attr('class', 'alt-axis')
        .attr('transform', `translate(${margin.left+tickSizeValue},${margin.top})`)
        .call(altAxis);

    svg.select('.alt-axis path').style('stroke', 'none');
}

export function updateAltMap(locationData: number[]){
    const container = document.querySelector("#altMapContainer");
    if (container === null || !global_altScale) {
        return;
    }
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    // Use the global rescaled altScale
    d3.select("#altMapPoints")
        .selectAll('circle')
        .data([locationData])  // Bind the array of points
        .join('circle')
        .attr('fill', 'blue')
        .attr('cx', container.clientWidth / 2)  // Use rescaled longitude
        .attr('cy', (d: any) => global_altScale(d[2]) + margin.top)   // Use rescaled latitude
        .attr('r', 5)
        .style("z-index", 50)
}

export default function Altitude() {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(()=>{
        if (!containerRef.current) return;
        const margin = { top: 10, right: 10, bottom: 40, left: 30 };

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        const altScale = d3.scaleLinear().domain([0, 1000]).range([height, 0]);
        
        global_altScale = altScale;

        loadLeftAxis(containerRef, svgRef, altScale);

        const zoom: any= d3.zoom()
            .translateExtent([   // Set panning limits based on the axes bounds
                [0, 0],   // Upper left corner (min x, min y)
                [containerWidth, height + margin.bottom]  // Bottom right corner (max x, max y)
            ])
            .scaleExtent([1, 10])  // Set minimum scale 1 (no zoom out) and max scale 10 (upper zoom bound)
            .on('zoom', (event: any) => {

                // Get the scale factor only from the zoom event
                const new_altScale = event.transform.rescaleY(altScale);

                // Update the global scales
                global_altScale = new_altScale;

                // Clear and redraw axes with the updated scales
                loadLeftAxis(containerRef, svgRef, global_altScale);

                // Update the map points (or other graphical elements)
                d3.selectAll('#mapPoints circle')
                    .attr('cy', (d: any) => new_altScale(d[0]) + margin.top);
        });

        d3.select(svgRef.current).call(zoom);
    }, [])

    return (
        <div ref={containerRef} id="altMapContainer" className="bg-blue-500 h-full grow">
            <svg ref={svgRef}>
                <g id="altMapPoints"></g>
            </svg>
        </div>
    )

}
