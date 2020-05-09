import React from "react";
import moment from 'moment';

import '../styles/components-styles/list.scss';
import Items from './Items';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: localStorage.getItem("pageNumber") || 0,
      hits: [],
      error: false,
      startIndex: 1
    };
    this.loadNext = this.loadNext.bind(this);
  }

  componentDidMount() {
    this.getDataFromApi(this.state.pageNumber);
  }

  loadNext = () => {
      const next = +localStorage.getItem('pageNumber') + 1;
      localStorage.setItem('pageNumber', next);
      this.getDataFromApi(next);
  }

  getDataFromApi(pageNumber) {
    fetch(`https://hn.algolia.com/api/v1/search_by_date?page=${pageNumber}`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState(() => ({ hits: result.hits, error: false, pageNumber }));
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
        return a.diff(b, "years") + ' year ago';
    } else if (a.diff(b, "months") > 0) {
        return a.diff(b, "months") + ' month ago';
    } else if (a.diff(b, "weeks") > 0) {
        return a.diff(b, "weeks") + ' week ago';
    } else if (a.diff(b, "days") > 0) {
        return a.diff(b, "days") + ' day ago';
    } else if (a.diff(b, "hours") > 0) {
        return a.diff(b, "hours") + ' hour ago';
    } else if (a.diff(b, "minutes") > 0) {
        return a.diff(b, "minutes") + ' minute ago';
    } else  {
        return a.diff(b, "seconds") + ' seconds ago';
    }
  }
  render() {
    return (
        <React.Fragment>
            <React.Fragment>
                {this.state.hits.length > 0  && this.state.hits.map((item, index) =>{
                    item.domain = item.story_url ? `(${item.story_url.split('/')[2]})`: null;
                    item.timeDifference = this.getTimeDifference(item.created_at);
                    return <Items key={index} item={item} index={this.state.startIndex++} />  
                })}
            </React.Fragment>
            <React.Fragment>
                <div onClick={this.loadNext} className="more">
                    More
                </div>
            </React.Fragment>
        </React.Fragment>   
    );
  }
}

export default List;
