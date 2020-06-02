import React from 'react';

export default class Scroller extends React.Component {
    componentDidMount() {
    const toTop = document.querySelector('.to-top');
    window.addEventListener("scroll", () => {
    if (window.pageYOffset > 150) {
      toTop.classList.add("active");
    } else {
      toTop.classList.remove("active");
    }
  })
}

  handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  render() {
    return (
      <div className="to-top" onClick={this.handleClick} style={{textDecoration: "none"}}>
      <i className="fas fa-chevron-up"></i>
      </div>
    )
  }
}
