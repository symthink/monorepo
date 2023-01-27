// see:  https://codepen.io/brendandougan/pen/PpEzRp
import { Component, h, Prop, Element } from '@stencil/core';
import { tree, select } from 'd3';
import { hierarchy } from 'd3-hierarchy';
import { SymThink, SymThinkDocument } from '../../core/symthink.class';

@Component({
  tag: 'd2-outline',
  styleUrl: 'd2-outline.scss',
  shadow: false,
})
export class D2Outline {
  @Element() el: HTMLElement;

  @Prop() doc: Promise<SymThinkDocument>;
  @Prop() active: string;

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
  data = {};

  async componentWillLoad() {
    return this.doc.then((symthink) => this.convertData(symthink));
  }

  async componentWillUpdate() {
    const IDs = this.active.split(',');
    this.el.querySelectorAll('.node').forEach(n => n.classList.remove('highlight'));
    for(let id of IDs) {
      const el = document.getElementById('node-' + id);
      if (el) {
        el.classList.add('highlight');
      }
    }
  }

  async convertData(symthink: SymThinkDocument) {
    function callback(obj: any) {
      const st: SymThink = this;
      if (st && st.shortText) {
        obj.id = st.id;
        obj.name = st?.shortText;
        obj.type = st.type;
        if (st?.hasKids()) {
          obj.children = [];
          for (let card of st.support) {
            const o = {};
            obj.children.push(callback.call(card, [o]));
          }
        }
        return obj;
      } else {
        console.warn('No Symthink to convert to d3 format for tree viewing');
        return obj;
      }
    }

    this.data = callback.call(symthink, {});
  }

  createOutlineView() {
    const container: HTMLDivElement = document.querySelector(
      '.hierarchy-container'
    );
    var child = container.lastElementChild;
    while (child) {
      container.removeChild(child);
      child = container.lastElementChild;
    }
    this.margin = { top: 20, right: 10, bottom: 20, left: 10 };
    this.width = container.offsetWidth - this.margin.right - this.margin.left;
    this.height = container.offsetHeight - this.margin.top - this.margin.bottom;
    this.barHeight = 32;
    this.barWidth = this.width * 0.8;
    this.i = 0;
    this.duration = 750;
    this.tree = tree().size([this.width, this.height]);
    // this.tree = tree().nodeSize([0, 30]);

    this.tree = tree().nodeSize([0, 30]);

    this.root = this.tree(hierarchy(this.data));
    this.root.each((d) => {
      d.name = d.id; //transferring name to a name variable
      d.id = this.i; //Assigning numerical Ids
      this.i++;
    });
    this.root.x0 = this.root.x;
    this.root.y0 = this.root.y;
    this.svg = select('.hierarchy-container')
      .append('svg')
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

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
    window.addEventListener('resize', func);
  }

  connector(d: any) {
    //curved
    // return "M" + d.y + "," + d.x +
    //    "C" + (d.y + d.parent.y) / 2 + "," + d.x +
    //    " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
    //    " " + d.parent.y + "," + d.parent.x;
    //straight
    return 'M' + d.parent.y + ',' + d.parent.x + 'V' + d.x + 'H' + d.y;
  }

  collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
  }

  click(_evt, d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  }

  update(source) {
    // this.width = 800;

    // const type = source?.data?.type;
    // console.log('-update()', source?.data, type);

    // Compute the new tree layout.
    let nodes = this.tree(this.root);
    let nodesSort = [];
    nodes.eachBefore(function (n) {
      nodesSort.push(n);
    });
    this.height = Math.max(
      500,
      nodesSort.length * this.barHeight + this.margin.top + this.margin.bottom
    );
    let links = nodesSort.slice(1);
    // Compute the "layout".
    nodesSort.forEach((n, i) => {
      n.x = i * this.barHeight;
    });

    select('svg')
      .transition()
      .duration(this.duration)
      .attr('height', this.height);

    // Update the nodes…
    let node = this.svg.selectAll('g.node').data(nodesSort, function (d: any) {
      return d.id || (d.id = ++this.i);
    });    

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node
      .enter()
      .append('g')
      .attr('id', (d) => `node-${d.data?.id}`)
      .attr('class', (d) => `node type-${d.data?.type?.toLowerCase()}`)
      .attr('transform', function () {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .on('click', this.click.bind(this));

    nodeEnter
      .append('circle')
      .attr('r', 1e-6)
      .style('fill', function (d: any) {
        return d._children ? 'lightsteelblue' : '#fff';
      });

    nodeEnter
      .append('text')
      .attr('x', function (d: any) {
        return d.children || d._children ? 10 : 10;
      })
      .attr('dy', '.35em')
      .attr('text-anchor', function (d: any) {
        return d.children || d._children ? 'start' : 'start';
      })
      .text(d => d.data.name);
      // .style('fill-opacity', 1e-6);

    nodeEnter.append('svg:title').text(function (d: any) {
      return d.data.name;
    });

    // Transition nodes to their new position.
    let nodeUpdate = node.merge(nodeEnter).transition().duration(this.duration);

    nodeUpdate.attr('transform', function (d: any) {
      return 'translate(' + d.y + ',' + d.x + ')';
    });

    nodeUpdate
      .select('circle')
      .attr('r', 4.5)
      .style('fill', function (d: any) {
        return d._children ? 'lightsteelblue' : '#fff';
      });

    // nodeUpdate.select('text').style('fill-opacity', 1);

    // Transition exiting nodes to the parent's new position (and remove the nodes)
    var nodeExit = node.exit().transition().duration(this.duration);

    nodeExit
      .attr('transform', function (_d) {
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    nodeExit.select('circle').attr('r', 1e-6);

    nodeExit.select('text').style('fill-opacity', 1e-6);

    // Update the links…
    var link = this.svg.selectAll('path.link').data(links, function (d: any) {
      // return d.target.id;
      var id = d.id + '->' + d.parent.id;
      return id;
    });

    // Enter any new links at the parent's previous position.
    let linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (_d) => {
        var o = {
          x: source.x0,
          y: source.y0,
          parent: { x: source.x0, y: source.y0 },
        };
        return this.connector(o);
      });

    // Transition links to their new position.
    link
      .merge(linkEnter)
      .transition()
      .duration(this.duration)
      .attr('d', this.connector);

    // // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition()
      .duration(this.duration)
      .attr('d', (_d: any) => {
        var o = {
          x: source.x,
          y: source.y,
          parent: { x: source.x, y: source.y },
        };
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
      <ion-content class="outline-content">
        <div class="hierarchy-container"></div>
      </ion-content>,
    ];
  }
}
