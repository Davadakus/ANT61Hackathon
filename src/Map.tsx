import { useRef, useEffect } from "react";
import * as d3 from "d3";

function loadLeftAxis(containerRef: any, svgRef: any, gRef: any){
    const margin = { top: 0, right: 10, bottom: 40, left: 30 }; // Margin for g in svg
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    
    // Create the SVG container
    const svg = d3.select(svgRef.current)
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')  
        .attr('width', '100%')  
        .attr('height', '100%');  
    
    // Define the scale from -90 to 90
    const yScale = d3.scaleLinear()
    .domain([-90, 90])  // Data range
    .range([height, 0]);  // Inverted because SVG y-coordinates grow downwards

    // Define the axis
    const yAxis = d3.axisLeft(yScale)
        .tickValues(d3.range(-90, 91, 10)); 
    
    // Append the axis to the SVG
    const g = d3.select(gRef.current);
    g.append('g')
        .attr('transform', `translate(${margin.left},${(containerHeight - height)/ 2})`)
        .call(yAxis);
}

function loadBottomAxis(containerRef: any, svgRef: any, gRef: any){
    const margin = { top: 5, right: 10, bottom: 15, left: 30 }; // Margin for g in svg
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    
    // Create the SVG container
    const svg = d3.select(svgRef.current)
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')  
        .attr('width', '100%')  
        .attr('height', '100%');  
    
    // Define the scale from -90 to 90
    const xScale = d3.scaleLinear()
    .domain([-180, 180])
    .range([width, 0]);  // Inverted because SVG y-coordinates grow downwards

    // Define the axis
    const yAxis = d3.axisBottom(xScale)
        .tickValues(d3.range(-180, 181, 20)); 

        
    // Append the axis to the SVG
    const g = d3.select(gRef.current);
    g.append('g')
        .attr('transform', `translate(${margin.left},${(height)})`)
        .call(yAxis)
}

export function updateMap(locationData: number[]) {
    const container = document.querySelector("#mapContainer");
    if (container === null){
        return;
    }
    const margin = { top: 10, right: 10, bottom: 40, left: 30 };
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const latitude = locationData[0];
    const longitude = locationData[1];

    // Define the scales for latitude and longitude
    const yScale = d3.scaleLinear()
        .domain([-90, 90])  // Latitude from -90 to 90 degrees
        .range([height, 0]);  // Inverted to map SVG coordinates

    const xScale = d3.scaleLinear()
        .domain([-180, 180])  // Longitude from -180 to 180 degrees
        .range([0, width]);

    d3.select("#mapPoints")
        .selectAll('circle')
        .data([locationData])  // Bind the array of points
        .join('circle')
        .attr('fill', 'blue')
        .attr('cx', xScale(longitude) + margin.left)  // Use xScale for longitude
        .attr('cy', yScale(latitude) + margin.top)   // Use yScale for latitude
        .attr('r', 5);
}


export default function Map(){
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const gRef = useRef<SVGGElement | null>(null); // Reference for the zoomable group

    useEffect(() => {
        if (!containerRef.current || !svgRef.current || !gRef.current) return;
        loadLeftAxis(containerRef, svgRef, gRef);
        loadBottomAxis(containerRef, svgRef, gRef);

        let zoom = d3.zoom()
            .on('zoom', (e) => {
                d3.select(gRef.current)
                    .attr('transform', e.transform);
            });
        d3.select(svgRef.current)
            .call(zoom);

    }, []);

    return (
        <div ref={containerRef} id="mapContainer" className="bg-red-500 h-full grow">
            <svg ref={svgRef}>
                <g ref={gRef}>  
                    {/* All axes and map points will be inside this group for zooming */}
                    <g id="mapPoints"></g>
                </g>
            </svg>
        </div>
    );
}