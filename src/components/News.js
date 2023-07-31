import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export default class News extends Component {
  static defaultProps = {
     country:'in',
     pageSize:9,
     category:'general'
  }
  static propTypes = {
    country :PropTypes.string,
    pageSize:PropTypes.number
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props){
    super(props);
    this.state = {
       articles : [],
       loading: false,
       page:1
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`
  }

 async updateNews(){
  const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a8380a3d62f240bd8daf68f57cae7814&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
    let data = await fetch(url);
    let parsedData = await data.json()
    this.setState ({articles:parsedData.articles,
      totalResults:parsedData.totalResults,
      loading:false
    })
 } 

 async componentDidMount(){
    this.updateNews();
 }  

handlepreviousclick = async () => {
this.setState({page: this.state.page - 1})
this.updateNews()
 }
 handleNextClick = async () => {
  this.setState({page: this.state.page + 1})
  this.updateNews();
 }

  render() {
    return (
      <div className='container my-3'>
        <h1 className='text-center' style={{margin:'35px 0px'}} >NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
      {this.state.loading && <Spinner/>}
        <div className='row'>
         {!this.state.loading && this.state.articles.map((element) => {
            return (
              <div key = {element.url} className="col-md-4">
          <NewsItem title = {element.title?element.title.slice(0,44):" "} description = {element.description?element.description.slice(0,88):""}  imageUrl = {!element.urlToImage?"https://img.freepik.com/free-vector/vector-illustration-mountain-landscape_1441-72.jpg?w=2000":element.urlToImage} newsurl = {element.url} author = {element.author} date = {element.publishedAt} source = {element.source.name} />
          </div>
            )
          })}
        </div>
        <div className='container d-flex justify-content-between my-2'>
             <button disabled={this.state.page<=1} type='button' className='btn btn-dark' onClick={this.handlepreviousclick} > &larr;Previous</button>
             <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type='button' className='btn btn-dark mx-2' onClick={this.handleNextClick} >Next &rarr;</button>
        </div>
        <div className='container text-center' style={{margin:"30px 0px 0px 0px"}} >
         <p>Design and Developed by Syed Maaz</p>
        </div>
      </div>
    )
  }
}
