import { useRef, useEffect } from "react";
import * as d3 from "d3";
import * as topojson from 'topojson-client';

let global_xScale: any;
let global_yScale: any;
const tickSizeValue: number = 500;

function loadLeftAxis(containerRef: any, svgRef: any, yScale: any) {
    const margin = { top: 10, right: 10, bottom: 40, left: 30 };
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
        .ticks(15)  // Increase number of ticks based on zoom level
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
        .ticks(15)  // Increase number of ticks based on zoom level
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
        .attr('fill', '#e5e7eb')
        .attr('cx', (d: any) => global_xScale(d[1]) + margin.left)  // Use rescaled longitude
        .attr('cy', (d: any) => global_yScale(d[0]) + margin.top)   // Use rescaled latitude
        .attr('r', 5)
        .style("z-index", 50)
}

export default function Map() {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        const margin = { top: 10, right: 10, bottom: 30, left: 30 };
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
            .translateExtent([   // Set panning limits based on the axes bounds
                [0, 0],   // Upper left corner (min x, min y)
                [containerWidth, height + margin.bottom]  // Bottom right corner (max x, max y)
            ])
            .scaleExtent([1, 100])  // Set minimum scale 1 (no zoom out) and max scale 10 (upper zoom bound)
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

                // Update the map points (or other graphical elements)
                d3.selectAll('#mapPoints circle')
                    .attr('cx', (d: any) => new_xScale(d[1]) + margin.left)
                    .attr('cy', (d: any) => new_yScale(d[0]) + margin.top);
            });

        d3.select(svgRef.current).call(zoom);
    }, []);

    return (
        <div ref={containerRef} id="mapContainer" className="bg-neutral-700 h-full grow rounded flex-1">
            <svg ref={svgRef}>
                <g id="mapPoints"></g>
            </svg>
        </div>
    );
}