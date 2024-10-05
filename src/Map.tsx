import { useRef, useEffect } from "react";
import * as d3 from "d3";

function loadLeftAxis(containerRef: any, svgRef: any){
    const margin = { top: 5, right: 30, bottom: 5, left: 30 }; // Margin for g in svg
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
    svg.append('g')
        .attr('transform', `translate(${margin.left},${(containerHeight - height)/ 2})`)
        .call(yAxis);
}

function loadBottomAxis(containerRef: any, svgRef: any){
    const margin = { top: 5, right: 30, bottom: 5, left: 30 }; // Margin for g in svg
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
    .domain([0, 180])  // Data range
    .range([width, 0]);  // Inverted because SVG y-coordinates grow downwards

    // Define the axis
    const yAxis = d3.axisBottom(xScale);
        
    // Append the axis to the SVG
    svg.append('g')
        .attr('transform', `translate(${margin.left},${(containerHeight - height)/ 2})`)
        .call(yAxis);
}


export default function Map(){
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;  // Guard clause for null refs
        loadLeftAxis(containerRef, svgRef);
        loadBottomAxis(containerRef, svgRef);
    }, []);

    return (
        <div ref={containerRef} className="bg-red-500 h-full">
            <svg ref={svgRef}></svg>
        </div>
    );
}