import { Component, EventEmitter, Event, h, Prop } from '@stencil/core';
import { CAB } from '../../core/interfaces';

enum EntityIcon {
  NotEqual = '&#8800;',
  Pencil = '&#x270E;',
  Dollar = '&#x24;',
  Link = '&#x1F517;'
}

@Component({
  tag: 'd2-cab',
  styleUrl: 'd2-cab.css'
})
export class D2Cab {

  @Event() btnClick: EventEmitter<void>;

  @Prop() name: CAB;

  getEntityIcon(name: CAB) {
    switch(name) {
      case CAB.Edit:
        return EntityIcon.Pencil;
      case CAB.Pay:
        return EntityIcon.Dollar;
      case CAB.TagFallacy:
        return EntityIcon.NotEqual;
      case CAB.Link:
        return EntityIcon.Link;
      default: 
        return '?';
    }
  }

  onClick() {
    this.btnClick.emit();
  }

  render() {
    return (
    <button onClick={this.onClick.bind(this)} class="circle-btn">
      <div class="circle">
        <span innerHTML={this.getEntityIcon(this.name)}></span>
      </div>
      <label>{this.name}</label>
    </button>
  );
  }

}
