import i18n from "@sitevision/api/common/i18n";
import PropTypes from "prop-types";
import * as React from "react";


const Posts = ({ posts }) => {    
    return (
        <div class="example-demo-dark">
            {posts && posts.map((post) => {
                return (
                    // <dl class={`${post.newPost ? 'env-block-primary env-block-primary--border' : 'env-border-color--warning'} env-definition-list env-definition-list--horizontal`}>
                    //     <dt>{post.author}</dt>
                    //     <dd>{post.feedback}</dd>
                    // </dl>
                    <article
                        class={`${post.newPost ? 'env-block-secondary env-block-secondary--border' : 'env-block-primary env-block-primary--border'} example-card env-card env-border env-shadow-small`}
                    >
                        <div class="env-card__body">
                            <p class="env-ui-text-caption">
                                {i18n.get("author")}: {post.author}
                            </p>
                            <p class="env-ui-text-caption">
                                {i18n.get("comment")}: {post.feedback}
                            </p>
                        </div>
                    </article>
                )
            })}
        </div>
    );
};

Posts.propTypes = {
  posts: PropTypes.array,
};

export default Posts;