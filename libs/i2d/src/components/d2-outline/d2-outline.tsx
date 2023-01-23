import { Component, h, Prop } from '@stencil/core';
import { tree, select } from 'd3';
import { hierarchy } from 'd3-hierarchy';
import { SymThink, SymThinkDocument } from '../../core/symthink.class';

@Component({
  tag: 'd2-outline',
  styleUrl: 'd2-outline.scss',
  shadow: false,
})
export class D2Outline {
  @Prop() doc: Promise<SymThinkDocument>;

  margin: { left: number; right: number; top: number; bottom: number };
  width: number;
  height: number;
  barHeight: number;
  barWidth: number;
  i: number;
  duration: number;
  tree;
  root;
  svg;
  data = {
    "name": "flare",
    "children": [
     {
      "name": "analytics",
      "children": [
       {
        "name": "cluster",
        "children": [
         {"name": "AgglomerativeCluster", "size": 3938},
         {"name": "CommunityStructure", "size": 3812},
         {"name": "HierarchicalCluster", "size": 6714},
         {"name": "MergeEdge", "size": 743}
        ]
       },
       {
        "name": "graph",
        "children": [
         {"name": "BetweennessCentrality", "size": 3534},
         {"name": "LinkDistance", "size": 5731},
         {"name": "MaxFlowMinCut", "size": 7840},
         {"name": "ShortestPaths", "size": 5914},
         {"name": "SpanningTree", "size": 3416}
        ]
       },
       {
        "name": "optimization",
        "children": [
         {"name": "AspectRatioBanker", "size": 7074}
        ]
       }
      ]
     },
     {
      "name": "animate",
      "children": [
       {"name": "Easing", "size": 17010},
       {"name": "FunctionSequence", "size": 5842},
       {
        "name": "interpolate",
        "children": [
         {"name": "ArrayInterpolator", "size": 1983},
         {"name": "ColorInterpolator", "size": 2047},
         {"name": "DateInterpolator", "size": 1375},
         {"name": "Interpolator", "size": 8746},
         {"name": "MatrixInterpolator", "size": 2202},
         {"name": "NumberInterpolator", "size": 1382},
         {"name": "ObjectInterpolator", "size": 1629},
         {"name": "PointInterpolator", "size": 1675},
         {"name": "RectangleInterpolator", "size": 2042}
        ]
       },
       {"name": "ISchedulable", "size": 1041},
       {"name": "Parallel", "size": 5176},
       {"name": "Pause", "size": 449},
       {"name": "Scheduler", "size": 5593},
       {"name": "Sequence", "size": 5534},
       {"name": "Transition", "size": 9201},
       {"name": "Transitioner", "size": 19975},
       {"name": "TransitionEvent", "size": 1116},
       {"name": "Tween", "size": 6006}
      ]
     },
     {
      "name": "data",
      "children": [
       {
        "name": "converters",
        "children": [
         {"name": "Converters", "size": 721},
         {"name": "DelimitedTextConverter", "size": 4294},
         {"name": "GraphMLConverter", "size": 9800},
         {"name": "IDataConverter", "size": 1314},
         {"name": "JSONConverter", "size": 2220}
        ]
       },
       {"name": "DataField", "size": 1759},
       {"name": "DataSchema", "size": 2165},
       {"name": "DataSet", "size": 586},
       {"name": "DataSource", "size": 3331},
       {"name": "DataTable", "size": 772},
       {"name": "DataUtil", "size": 3322}
      ]
     },
     {
      "name": "display",
      "children": [
       {"name": "DirtySprite", "size": 8833},
       {"name": "LineSprite", "size": 1732},
       {"name": "RectSprite", "size": 3623},
       {"name": "TextSprite", "size": 10066}
      ]
     },
     {
      "name": "flex",
      "children": [
       {"name": "FlareVis", "size": 4116}
      ]
     },
     {
      "name": "physics",
      "children": [
       {"name": "DragForce", "size": 1082},
       {"name": "GravityForce", "size": 1336},
       {"name": "IForce", "size": 319},
       {"name": "NBodyForce", "size": 10498},
       {"name": "Particle", "size": 2822},
       {"name": "Simulation", "size": 9983},
       {"name": "Spring", "size": 2213},
       {"name": "SpringForce", "size": 1681}
      ]
     },
     {
      "name": "query",
      "children": [
       {"name": "AggregateExpression", "size": 1616},
       {"name": "And", "size": 1027},
       {"name": "Arithmetic", "size": 3891},
       {"name": "Average", "size": 891},
       {"name": "BinaryExpression", "size": 2893},
       {"name": "Comparison", "size": 5103},
       {"name": "CompositeExpression", "size": 3677},
       {"name": "Count", "size": 781},
       {"name": "DateUtil", "size": 4141},
       {"name": "Distinct", "size": 933},
       {"name": "Expression", "size": 5130},
       {"name": "ExpressionIterator", "size": 3617},
       {"name": "Fn", "size": 3240},
       {"name": "If", "size": 2732},
       {"name": "IsA", "size": 2039},
       {"name": "Literal", "size": 1214},
       {"name": "Match", "size": 3748},
       {"name": "Maximum", "size": 843},
       {
        "name": "methods",
        "children": [
         {"name": "add", "size": 593},
         {"name": "and", "size": 330},
         {"name": "average", "size": 287},
         {"name": "count", "size": 277},
         {"name": "distinct", "size": 292},
         {"name": "div", "size": 595},
         {"name": "eq", "size": 594},
         {"name": "fn", "size": 460},
         {"name": "gt", "size": 603},
         {"name": "gte", "size": 625},
         {"name": "iff", "size": 748},
         {"name": "isa", "size": 461},
         {"name": "lt", "size": 597},
         {"name": "lte", "size": 619},
         {"name": "max", "size": 283},
         {"name": "min", "size": 283},
         {"name": "mod", "size": 591},
         {"name": "mul", "size": 603},
         {"name": "neq", "size": 599},
         {"name": "not", "size": 386},
         {"name": "or", "size": 323},
         {"name": "orderby", "size": 307},
         {"name": "range", "size": 772},
         {"name": "select", "size": 296},
         {"name": "stddev", "size": 363},
         {"name": "sub", "size": 600},
         {"name": "sum", "size": 280},
         {"name": "update", "size": 307},
         {"name": "variance", "size": 335},
         {"name": "where", "size": 299},
         {"name": "xor", "size": 354},
         {"name": "_", "size": 264}
        ]
       },
       {"name": "Minimum", "size": 843},
       {"name": "Not", "size": 1554},
       {"name": "Or", "size": 970},
       {"name": "Query", "size": 13896},
       {"name": "Range", "size": 1594},
       {"name": "StringUtil", "size": 4130},
       {"name": "Sum", "size": 791},
       {"name": "Variable", "size": 1124},
       {"name": "Variance", "size": 1876},
       {"name": "Xor", "size": 1101}
      ]
     },
     {
      "name": "scale",
      "children": [
       {"name": "IScaleMap", "size": 2105},
       {"name": "LinearScale", "size": 1316},
       {"name": "LogScale", "size": 3151},
       {"name": "OrdinalScale", "size": 3770},
       {"name": "QuantileScale", "size": 2435},
       {"name": "QuantitativeScale", "size": 4839},
       {"name": "RootScale", "size": 1756},
       {"name": "Scale", "size": 4268},
       {"name": "ScaleType", "size": 1821},
       {"name": "TimeScale", "size": 5833}
      ]
     },
     {
      "name": "util",
      "children": [
       {"name": "Arrays", "size": 8258},
       {"name": "Colors", "size": 10001},
       {"name": "Dates", "size": 8217},
       {"name": "Displays", "size": 12555},
       {"name": "Filter", "size": 2324},
       {"name": "Geometry", "size": 10993},
       {
        "name": "heap",
        "children": [
         {"name": "FibonacciHeap", "size": 9354},
         {"name": "HeapNode", "size": 1233}
        ]
       },
       {"name": "IEvaluable", "size": 335},
       {"name": "IPredicate", "size": 383},
       {"name": "IValueProxy", "size": 874},
       {
        "name": "math",
        "children": [
         {"name": "DenseMatrix", "size": 3165},
         {"name": "IMatrix", "size": 2815},
         {"name": "SparseMatrix", "size": 3366}
        ]
       },
       {"name": "Maths", "size": 17705},
       {"name": "Orientation", "size": 1486},
       {
        "name": "palette",
        "children": [
         {"name": "ColorPalette", "size": 6367},
         {"name": "Palette", "size": 1229},
         {"name": "ShapePalette", "size": 2059},
         {"name": "SizePalette", "size": 2291}
        ]
       },
       {"name": "Property", "size": 5559},
       {"name": "Shapes", "size": 19118},
       {"name": "Sort", "size": 6887},
       {"name": "Stats", "size": 6557},
       {"name": "Strings", "size": 22026}
      ]
     },
     {
      "name": "vis",
      "children": [
       {
        "name": "axis",
        "children": [
         {"name": "Axes", "size": 1302},
         {"name": "Axis", "size": 24593},
         {"name": "AxisGridLine", "size": 652},
         {"name": "AxisLabel", "size": 636},
         {"name": "CartesianAxes", "size": 6703}
        ]
       },
       {
        "name": "controls",
        "children": [
         {"name": "AnchorControl", "size": 2138},
         {"name": "ClickControl", "size": 3824},
         {"name": "Control", "size": 1353},
         {"name": "ControlList", "size": 4665},
         {"name": "DragControl", "size": 2649},
         {"name": "ExpandControl", "size": 2832},
         {"name": "HoverControl", "size": 4896},
         {"name": "IControl", "size": 763},
         {"name": "PanZoomControl", "size": 5222},
         {"name": "SelectionControl", "size": 7862},
         {"name": "TooltipControl", "size": 8435}
        ]
       },
       {
        "name": "data",
        "children": [
         {"name": "Data", "size": 20544},
         {"name": "DataList", "size": 19788},
         {"name": "DataSprite", "size": 10349},
         {"name": "EdgeSprite", "size": 3301},
         {"name": "NodeSprite", "size": 19382},
         {
          "name": "render",
          "children": [
           {"name": "ArrowType", "size": 698},
           {"name": "EdgeRenderer", "size": 5569},
           {"name": "IRenderer", "size": 353},
           {"name": "ShapeRenderer", "size": 2247}
          ]
         },
         {"name": "ScaleBinding", "size": 11275},
         {"name": "Tree", "size": 7147},
         {"name": "TreeBuilder", "size": 9930}
        ]
       },
       {
        "name": "events",
        "children": [
         {"name": "DataEvent", "size": 2313},
         {"name": "SelectionEvent", "size": 1880},
         {"name": "TooltipEvent", "size": 1701},
         {"name": "VisualizationEvent", "size": 1117}
        ]
       },
       {
        "name": "legend",
        "children": [
         {"name": "Legend", "size": 20859},
         {"name": "LegendItem", "size": 4614},
         {"name": "LegendRange", "size": 10530}
        ]
       },
       {
        "name": "operator",
        "children": [
         {
          "name": "distortion",
          "children": [
           {"name": "BifocalDistortion", "size": 4461},
           {"name": "Distortion", "size": 6314},
           {"name": "FisheyeDistortion", "size": 3444}
          ]
         },
         {
          "name": "encoder",
          "children": [
           {"name": "ColorEncoder", "size": 3179},
           {"name": "Encoder", "size": 4060},
           {"name": "PropertyEncoder", "size": 4138},
           {"name": "ShapeEncoder", "size": 1690},
           {"name": "SizeEncoder", "size": 1830}
          ]
         },
         {
          "name": "filter",
          "children": [
           {"name": "FisheyeTreeFilter", "size": 5219},
           {"name": "GraphDistanceFilter", "size": 3165},
           {"name": "VisibilityFilter", "size": 3509}
          ]
         },
         {"name": "IOperator", "size": 1286},
         {
          "name": "label",
          "children": [
           {"name": "Labeler", "size": 9956},
           {"name": "RadialLabeler", "size": 3899},
           {"name": "StackedAreaLabeler", "size": 3202}
          ]
         },
         {
          "name": "layout",
          "children": [
           {"name": "AxisLayout", "size": 6725},
           {"name": "BundledEdgeRouter", "size": 3727},
           {"name": "CircleLayout", "size": 9317},
           {"name": "CirclePackingLayout", "size": 12003},
           {"name": "DendrogramLayout", "size": 4853},
           {"name": "ForceDirectedLayout", "size": 8411},
           {"name": "IcicleTreeLayout", "size": 4864},
           {"name": "IndentedTreeLayout", "size": 3174},
           {"name": "Layout", "size": 7881},
           {"name": "NodeLinkTreeLayout", "size": 12870},
           {"name": "PieLayout", "size": 2728},
           {"name": "RadialTreeLayout", "size": 12348},
           {"name": "RandomLayout", "size": 870},
           {"name": "StackedAreaLayout", "size": 9121},
           {"name": "TreeMapLayout", "size": 9191}
          ]
         },
         {"name": "Operator", "size": 2490},
         {"name": "OperatorList", "size": 5248},
         {"name": "OperatorSequence", "size": 4190},
         {"name": "OperatorSwitch", "size": 2581},
         {"name": "SortOperator", "size": 2023}
        ]
       },
       {"name": "Visualization", "size": 16540}
      ]
     }
    ]
   };

  async componentWillLoad() {
    console.log('will load', this.doc);
    return this.doc.then((symthink) => this.convertData(symthink))
  }  

  async convertData(symthink: SymThinkDocument) {
    const o: any = {};
    symthink.find((c: SymThink) => {
      o.name = c.label || c.text;
      // LEFT OFF HERE
    })
  }

  createOutlineView() {
    const container: HTMLDivElement = document.querySelector('.hierarchy-container');
    this.margin = {top: 20, right: 10, bottom: 20, left: 10};
    this.width = container.offsetWidth - this.margin.right - this.margin.left;
    this.height = container.offsetHeight - this.margin.top - this.margin.bottom;
    this.barHeight = 20;
    this.barWidth = this.width *.8;
    this.i = 0;
    this.duration = 750;
    this.tree = tree().size([this.width, this.height]);
    // this.tree = tree().nodeSize([0, 30]);

    this.tree = tree().nodeSize([0, 30]); 

    // NEED TO CONVERT DATA HERE ---
    this.root = this.tree(hierarchy(this.data));
    this.root.each((d)=> {
      d.name = d.id; //transferring name to a name variable
      d.id = this.i; //Assigning numerical Ids
      this.i++;
    });
    this.root.x0 = this.root.x;
    this.root.y0 = this.root.y
    this.svg = select('.hierarchy-container').append('svg')
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // this.root.children.forEach(this.collapse);
    this.update(this.root);

  }

  getDebouncedResizeFunc() {
      let timer;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(() => this.createOutlineView(), 1000);
      };
  }

  componentDidLoad() {
    this.createOutlineView();

    const func = this.getDebouncedResizeFunc();
    window.addEventListener("resize", func);
    console.log('d2-outline componentDidLoad');

  }

  connector(d:any) {
    //curved 
    /*return "M" + d.y + "," + d.x +
       "C" + (d.y + d.parent.y) / 2 + "," + d.x +
       " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
       " " + d.parent.y + "," + d.parent.x;*/
     //straight
     return "M" + d.parent.y + "," + d.parent.x
       + "V" + d.x + "H" + d.y;      
   }
   
   collapse(d) {
     if (d.children) {
       d._children = d.children;
       d._children.forEach(this.collapse);
       d.children = null;
     }
   };
 
   click(d) {
     if (d.children) {
       d._children = d.children;
       d.children = null;
     } else {
       d.children = d._children;
       d._children = null;
     }
     this.update(d);
   };
 
   update(source) {
 
     this.width=800;
 
     // Compute the new tree layout.
     let nodes = this.tree(this.root)
     let nodesSort = [];
     nodes.eachBefore(function (n) {
       nodesSort.push(n);
     });
     this.height = Math.max(500, nodesSort.length * this.barHeight + this.margin.top + this.margin.bottom);
     let links = nodesSort.slice(1);
     // Compute the "layout".
     nodesSort.forEach ((n,i)=> {
       n.x = i *this.barHeight;
     });
 
     select('svg').transition()
       .duration(this.duration)
       .attr("height", this.height);
 
     // Update the nodes…
     let node = this.svg.selectAll('g.node')
     .data(nodesSort, function (d: any) {
       return d.id || (d.id = ++this.i);
     });
 
     // Enter any new nodes at the parent's previous position.
     var nodeEnter = node.enter().append('g')
     .attr('class', 'node')
     .attr('transform', function () {
       return 'translate(' + source.y0 + ',' + source.x0 + ')';
     })
     .on('click', this.click);
 
     nodeEnter.append('circle')
       .attr('r', 1e-6)
       .style('fill', function (d: any) {
       return d._children ? 'lightsteelblue' : '#fff';
     });
 
     nodeEnter.append('text')
       .attr('x', function (d: any) {
       return d.children || d._children ? 10 : 10;
     })
       .attr('dy', '.35em')
       .attr('text-anchor', function (d: any) {
       return d.children || d._children ? 'start' : 'start';
     })
       .text(function (d: any) {
       if (d.data.name.length > 20) {
         return d.data.name.substring(0, 20) + '...';
       } else {
         return d.data.name;
       }
     })
       .style('fill-opacity', 1e-6);
 
     nodeEnter.append('svg:title').text(function (d: any) {
       return d.data.name;
     });
 
     // Transition nodes to their new position.
     let nodeUpdate = node.merge(nodeEnter)
       .transition()
       .duration(this.duration);
     
     nodeUpdate
         .attr('transform', function (d: any) {
         return 'translate(' + d.y + ',' + d.x + ')';
       });
 
     nodeUpdate.select('circle')
       .attr('r', 4.5)
       .style('fill', function (d: any) {
       return d._children ? 'lightsteelblue' : '#fff';
     });
     
     nodeUpdate.select('text')
       .style('fill-opacity', 1);
 
     // Transition exiting nodes to the parent's new position (and remove the nodes)
     var nodeExit = node.exit().transition()
     .duration(this.duration);
     
     nodeExit
     .attr('transform', function (d) {
       return 'translate(' + source.y + ',' + source.x + ')';
     })
     .remove();
 
     nodeExit.select('circle')
       .attr('r', 1e-6);
 
     nodeExit.select('text')
       .style('fill-opacity', 1e-6);
     
     // Update the links…
     var link = this.svg.selectAll('path.link')
     .data(links, function (d: any) {
       // return d.target.id;
       var id = d.id + '->' + d.parent.id;
       return id;
     }
          );
 
     // Enter any new links at the parent's previous position.
     let linkEnter = link.enter().insert('path', 'g')
     .attr('class', 'link')
     .attr('d', (d) => {
       var o = {x: source.x0, y: source.y0, parent: {x: source.x0, y: source.y0}};
       return this.connector(o);
     });
     
     // Transition links to their new position.
     link.merge(linkEnter).transition()
       .duration(this.duration)
       .attr('d', this.connector);
 
 
     // // Transition exiting nodes to the parent's new position.
     link.exit().transition()
       .duration(this.duration)
       .attr('d', (d: any) => {
       var o = {x: source.x, y: source.y, parent: {x: source.x, y: source.y}};
       return this.connector(o);
     })
       .remove();
 
     // Stash the old positions for transition.
     nodesSort.forEach(function (d: any) {
       d.x0 = d.x;
       d.y0 = d.y;
     });
     
   }
  render() {
    return [
    <ion-header class="outline-header">
      <ion-toolbar color="secondary">
        <ion-title>Outline View</ion-title>
      </ion-toolbar>
      </ion-header>,
      <ion-content>
      <div class="hierarchy-container"></div>
    </ion-content>
    ]
  }
}
