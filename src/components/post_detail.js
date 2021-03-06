import React, { Component } from 'react';
import { fetchPostDetail, votePost, deletePost, fetchComments, voteComment, toggleCommentView, editComment, deleteComment, getCategories } from '../actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import CategorySubnav from './category_subnav';
import CommentsNew from './comments_new';
import CommentsListItem from './comments_list_item';
import CommentsEdit from './comments_edit';
import NotFound from './404.js';

class PostDetail extends Component {

  componentDidMount = () => {
    const { match: { params: { id } }, fetchPostDetail, fetchComments, getCategories } = this.props
    fetchPostDetail(id);
    fetchComments(id);
    getCategories();    
  }

  handleDelete = (id) => {
    this.props.deletePost(this.props.match.params.id, () => {
      this.props.history.push('/')
    });
  }

  handleCommentDelete = (CommentId) => {
    console.log("Been called to delete a comment");
    this.props.deleteComment(CommentId)
  }


  render() {

    // Is this the correct way to prevent loading data too early?
    // if (!posts || !posts["lists"] || !posts["lists"][id]) {
    //   return (<div>Loading</div>);
    // } 

    const { post, comments, categories, match : { params : { category } } } = this.props;

    if(!post || post.category !== category ) {
      return (
        <div className="container">
          <NotFound />
        </div>
      );
    }

    const orderedComments =  _.orderBy(comments["comments"], 'voteScore', 'desc' );
    // console.log("orderedComments is, ",comments["comments"], orderedComments );

    return (
      <div className="container">
        <CategorySubnav categories={categories} />

        <article key={post.id} className="media">
          <figure className="media-left votebox">
            <p className="has-text-centered">
            <span className="icon" onClick={() => this.props.votePost("upVote", post.id)}><i className="fa fa-caret-up fa-3x"></i></span>
            </p>
            <p className="has-text-centered has-text-info is-size-4 image is-48x48">
            {post.voteScore}
            </p>
            <p className="has-text-centered">
            <span className="icon" onClick={() => this.props.votePost("downVote", post.id)}><i className="fa fa-caret-down fa-3x"></i></span>
            </p>
          </figure>

          <div className="media-content">
            <div className="content">
              <p>
                <strong>{post.title}</strong>
                <br />
                {post.body}
              </p>
              <p>
                <small><span className="tag is-info">{post.category}</span> | by: {post.author}</small> <small> | {moment(post.timestamp).from()}</small>
              </p>
            </div>

            <nav className="level is-mobile">
                <div className="level-item has-text-centered">
                  <div>
                  <a>{post.commentCount}&nbsp;<i className="fa fa-comments"></i></a>                  
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                  <a onClick={this.handleDelete}><span className="icon comment"><i className="fa fa-times"></i></span></a>                  
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                  <Link to={`/${post.category}/${post.id}/edit`}><span className="icon comment"><i className="fa fa-pencil"></i></span></Link>
                  </div>
                </div>
              </nav>              
          </div>
          <div className="media-right"></div>
        </article>
        <hr />

        <nav className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <p className="subtitle is-5"><strong>Comments</strong></p>
            </div>
          </div>
          <div className="level-right"></div>
        </nav>

        <CommentsNew />

        {_.map(orderedComments, comment => {

        return (comments["editingCommentId"]===comment.id) ?
          (  
            <article key={comment.id} className="media">
              <CommentsEdit comment={comment}/>
            </article>
          ):(
            <article key={comment.id} className="media commentItem">
              <figure className="media-left votebox">
                <p className="has-text-centered has-text-info is-size-4 image is-48x48">
                  {comment.voteScore}
                </p>
              </figure>
              <CommentsListItem comment={comment} voteComment={this.props.voteComment} toggleCommentView={this.props.toggleCommentView} handleCommentDelete={this.handleCommentDelete} />
            </article>
          )}
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps ){ 
  // ES6: equivalent to state here and then const posts = state.posts in the body.
  // The rationale here for using ownProps is to just return the post requested, and not the entire {posts} object. 
  // For examlpe, this page will have a match.params.id prop available in ownProps.
  
  return {
    post: state.posts && state.posts["lists"] && state.posts["lists"][ownProps.match.params.id],
    comments: state.comments,
    categories: state.posts["categories"]
  };
}

// export default App;
export default  withRouter( connect(mapStateToProps, { fetchPostDetail, votePost, deletePost, fetchComments, voteComment, toggleCommentView, editComment, deleteComment, getCategories })(PostDetail) );