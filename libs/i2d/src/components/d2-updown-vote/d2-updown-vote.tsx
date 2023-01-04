import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'd2-updown-vote',
  styleUrl: 'd2-updown-vote.css',
  shadow: true,
})
export class D2UpdownVote {

  @Prop() votes = 0;

  upVote() { 
    this.votes++;
  }

  downVote() { 
    this.votes--;
  }

  render() {
    return (
      <Host>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z" />
        </svg>
        <span class="vote-count">{this.votes}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z" />
        </svg>
      </Host>
    );
  }

}
