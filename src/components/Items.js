import React from "react";
import "../styles/components-styles/item.scss";

class Items extends React.Component {
  constructor(props) {
    super(props);
    this.setHide = this.setHide.bind(this);
    this.upvote = this.upvote.bind(this);
  }

  setHide =() => {
    this.props.hide(this.props.item.story_id);
  }

  upvote = () => {
    this.props.upvote(this.props.item.story_id);
  }

  render() {
    return (
      <div className="item_container">
        <div className="index">{this.props.index}.</div>
        <button className="upvote_button" onClick={this.upvote} ><div className="upvote"></div></button>
        <div className="item_title_container">
          <div className="item_title">
            <div>
              {this.props.item.story_title ||
                (this.props.item._highlightResult.title &&
                  this.props.item._highlightResult.title.value)}
              <a
                className="item_domain"
                onClick={this.handleUrl}
                target="_blank"
                href={this.props.item.story_url}
              >
                {this.props.item.domain}
              </a>
            </div>
          </div>
          <div className="sub_text">
            <span>{this.props.item.points || 0}</span>
            <span> by {this.props.item.author} </span>

            <span>{this.props.item.timeDifference} | </span>
            <button className="hide" onClick={this.setHide}>hide</button>
            <span> | {this.props.item.num_comments || 0} comments</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Items;
