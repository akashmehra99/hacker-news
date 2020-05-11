import React from "react";
import moment from "moment";
import Chart from "react-google-charts";
import "../styles/components-styles/list.scss";
import Items from "./Items";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      hits: [],
      error: false,
      startIndex: 1,
    };
    this.loadNext = this.loadNext.bind(this);
    this.loadPrev = this.loadPrev.bind(this);
    this.hideStory = this.hideStory.bind(this);
    this.upVote = this.upVote.bind(this);
  }

  componentDidMount() {
    localStorage.setItem("pageNumber", 0);
    this.getDataFromApi(this.state.pageNumber);
  }

  hideStory = (objectID) => {
    const filtered = this.state.hits.filter(
      (item) => item.objectID !== objectID
    );
    this.state.startIndex = this.state.pageNumber * 20 + 1;
    this.setState(() => ({ hits: filtered }));
    let hidden = JSON.parse(localStorage.getItem('hidden')) || [];
    hidden.push(objectID);
    localStorage.setItem('hidden', JSON.stringify(hidden));
    // Code for api call to hide
  };

  hideDataOnRefresh = () => {
    const hidden = JSON.parse(localStorage.getItem('hidden')) || [];
    const hits = this.state.hits.filter((item) => hidden.indexOf(item.objectID) === -1);
    this.state.startIndex = this.state.pageNumber * 20 + 1;

    this.setState(() => ({hits}));
  }

  upVote = (objectID) => {
    let upvotes = JSON.parse(localStorage.getItem('upvotes')) || {};
    const hits = this.state.hits;
    for (let i = 0; i < hits.length; i++) {
      if (hits[i].objectID === objectID) {
        hits[i].points = (hits[i].points || 0) + 1;
        upvotes[objectID] = hits[i].points;
        break;
      }
    }
    localStorage.setItem('upvotes', JSON.stringify(upvotes));
    this.state.startIndex = this.state.pageNumber * 20 + 1;
    this.setState(() => ({ hits }));
    // api call for upVotes code goes here
  };

  updateVotes = () => {
    let upvotes = JSON.parse(localStorage.getItem('upvotes')) || {};
    const keys = Object.keys(upvotes);
    let hits = this.state.hits;
    for (let i = 0; i < hits.length; i++) {
      if (!keys.length) {
        break;
      }
      const ind = keys.indexOf(hits[i].objectID);
      if (ind > -1) {
        hits[i].points = upvotes[hits[i].objectID];
        delete keys[ind];
      }
    }
    this.state.startIndex = this.state.pageNumber * 20 + 1;
    this.setState(() => ({hits}));
  }

  loadNext = () => {
    const next = +localStorage.getItem("pageNumber") + 1;
    localStorage.setItem("pageNumber", next);
    this.getDataFromApi(next);
  };

  loadPrev = () => {
    const prev = +localStorage.getItem("pageNumber") - 1;
    localStorage.setItem("pageNumber", prev);
    this.state.startIndex = prev * 20 + 1;
    this.getDataFromApi(prev);
  };

  getDataFromApi(pageNumber) {
    fetch(
      `https://hn.algolia.com/api/v1/search_by_date?numericFilters=points>0,num_comments>0&page=${pageNumber}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState(() => ({
            hits: result.hits,
            error: false,
            pageNumber,
          }));
          this.hideDataOnRefresh();
          this.updateVotes();
          window.scrollTo(0, 0);
        },
        (error) => {
          this.setState(() => ({ error: true }));
        }
      );
  }
  getTimeDifference(time) {
    const a = moment();
    const b = moment(time);
    if (a.diff(b, "years") > 0) {
      return a.diff(b, "years") + " year ago";
    } else if (a.diff(b, "months") > 0) {
      return a.diff(b, "months") + " month ago";
    } else if (a.diff(b, "weeks") > 0) {
      return a.diff(b, "weeks") + " week ago";
    } else if (a.diff(b, "days") > 0) {
      return a.diff(b, "days") + " day ago";
    } else if (a.diff(b, "hours") > 0) {
      return a.diff(b, "hours") + " hour ago";
    } else if (a.diff(b, "minutes") > 0) {
      return a.diff(b, "minutes") + " minute ago";
    } else {
      return a.diff(b, "seconds") + " seconds ago";
    }
  }
  render() {
    const grapData = [["x", "Votes"]];
    for (let i = 0; i < this.state.hits.length; i++) {
      if (this.state.hits && this.state.hits[i].objectID) {
        grapData.push([
          +this.state.hits[i].objectID,
          +this.state.hits[i].points || 0,
        ]);
      }
    }
    return (
      <React.Fragment>
        <React.Fragment>
          {this.state.hits.length > 0 &&
            this.state.hits.map((item, index) => {
              item.domain = item.story_url
                ? `(${item.story_url.split("/")[2]})`
                : null;
              item.timeDifference = this.getTimeDifference(item.created_at);
              return (
                <Items
                  key={index}
                  item={item}
                  index={this.state.startIndex++}
                  upvote={(objectID) => this.upVote(objectID)}
                  hide={(objectID) => this.hideStory(objectID)}
                />
              );
            })}
        </React.Fragment>
        <div className="btn-container">
          <button
            onClick={this.loadPrev}
            disabled={this.state.pageNumber === 0}
            className="more"
          >
            Prev
          </button>
          <button onClick={this.loadNext} className="more">
            Next
          </button>
        </div>
        <div className="graph_container">
          <Chart
            width="100%"
            height="400px"
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={grapData}
            options={{
              hAxis: {
                title: "Story ID",
              },
              vAxis: {
                title: "Votes",
              },
            }}
            rootProps={{ "data-testid": "1" }}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default List;
