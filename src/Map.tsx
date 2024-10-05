import { useRef, useEffect } from "react";
import * as d3 from "d3";

let global_xScale: any;
let global_yScale: any;
const tickSizeValue: number = 500;

function loadLeftAxis(containerRef: any, svgRef: any, yScale: any) {
    const margin = { top: 0, right: 10, bottom: 40, left: 30 };
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('width', '100%')
        .attr('height', '100%');

        
    svg.select('.y-axis').remove();

    // Create the axis
    const yAxis = d3.axisLeft(yScale)
        .tickValues(d3.range(-90, 91, 10))
        .tickSize(tickSizeValue);

    // Append the axis to the g group
    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin.left+tickSizeValue},${margin.top})`)
        .call(yAxis);

    svg.select('.y-axis path').style('stroke', 'none');
}

function loadBottomAxis(containerRef: any, svgRef: any, xScale: any) {
    const margin = { top: 5, right: 10, bottom: 15, left: 30 };
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const width = containerWidth - margin.left - margin.right;

    const svg = d3.select(svgRef.current)
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('width', '100%')
        .attr('height', '100%');

    svg.select('.x-axis').remove();

    // Create the axis
    const xAxis = d3.axisBottom(xScale)
        .tickValues(d3.range(-180, 181, 20))
        .tickSize(tickSizeValue);

    // Append the axis to the g group
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${margin.left},${containerHeight - margin.bottom - tickSizeValue})`)
        .call(xAxis);

    svg.select('.x-axis path').style('stroke', 'none');
}

// Update map function to use the zoomed scales
export function updateMap(locationData: number[]) {
    const container = document.querySelector("#mapContainer");
    if (container === null || !global_xScale || !global_yScale) {
        return;
    }

    const margin = { top: 10, right: 10, bottom: 40, left: 30 };

    // Use the global rescaled xScale and yScale
    d3.select("#mapPoints")
        .selectAll('circle')
        .data([locationData])  // Bind the array of points
        .join('circle')
        .attr('fill', 'blue')
        .attr('cx', (d: any) => global_xScale(d[1]) + margin.left)  // Use rescaled longitude
        .attr('cy', (d: any) => global_yScale(d[0]) + margin.top)   // Use rescaled latitude
        .attr('r', 5);
}

export default function Map() {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        const margin = { top: 10, right: 10, bottom: 40, left: 30 };
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        // Define initial scales
        const xScale = d3.scaleLinear().domain([-180, 180]).range([0, width]);
        const yScale = d3.scaleLinear().domain([-90, 90]).range([height, 0]);

        global_xScale = xScale;
        global_yScale = yScale;

        // Load initial axes
        loadLeftAxis(containerRef, svgRef, yScale);
        loadBottomAxis(containerRef, svgRef, xScale);

        // Zoom behavior
        const zoom: any= d3.zoom()
            .on('zoom', (event: any) => {

                // Get the scale factor only from the zoom event
                const new_xScale = event.transform.rescaleX(xScale);
                const new_yScale = event.transform.rescaleY(yScale);

                // Update the global scales
                global_xScale = new_xScale;
                global_yScale = new_yScale;

                // Clear and redraw axes with the updated scales
                loadLeftAxis(containerRef, svgRef, global_yScale);
                loadBottomAxis(containerRef, svgRef, global_xScale);

                // Update the axes with the new scales
                // d3.select('.x-axis').call(d3.axisBottom(new_xScale).tickValues(d3.range(-180, 181, 20).tickSize(tickSizeValue)));
                // d3.select('.y-axis').call(d3.axisLeft(new_yScale).tickValues(d3.range(-90, 91, 10).tickSize(tickSizeValue)));

                // Update the map points (or other graphical elements)
                d3.selectAll('#mapPoints circle')
                    .attr('cx', (d: any) => new_xScale(d[1]) + margin.left)
                    .attr('cy', (d: any) => new_yScale(d[0]) + margin.top);
            });

        d3.select(svgRef.current).call(zoom);
    }, []);

    return (
        <div ref={containerRef} id="mapContainer" className="bg-red-500 h-full grow">
            <svg ref={svgRef}>
                <g id="mapPoints"></g>
            </svg>
        </div>
    );
}