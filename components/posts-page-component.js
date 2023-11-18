import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, page, renderApp, setPosts } from "../index.js";
import { getPosts, addLikePost, removeLikePost } from "../api.js";
import { formatDistance } from 'date-fns'
import { ru } from 'date-fns/locale'

export function renderPostsPageComponent({ appEl }) {

	// TODO: реализовать рендер постов из api!
	console.log("Актуальный список постов:", posts);
	let message = null;
	if (posts) {
		const getApiPosts = posts.map((postItem) => {
			return {
				postId: postItem.id,
				postImageUrl: postItem.imageUrl,
				postCreatedAt: formatDistance(new Date(postItem.createdAt), new Date, { locale: ru }),
				description: postItem.description,
				userId: postItem.user.id,
				userName: postItem.user.name,
				userLogin: postItem.user.login,
				postImageUserUrl: postItem.user.imageUrl,
				usersLikes: postItem.likes,
				isLiked: postItem.isLiked,
			}
		})
		message = getApiPosts.map((postItem, index) => {
			return `
			<li class="post">
			<div class="post-header" data-user-id="${postItem.userId}">
					<img src="${postItem.postImageUserUrl}" class="post-header__user-image">
					<p class="post-header__user-name">${postItem.userName}</p>
			</div>
			<div class="post-image-container">
				<img class="post-image" data-post-id="${postItem.postId}" src="${postItem.postImageUrl}"  data-index="${index}" >
			</div>
			<div class="post-likes">
				<button data-post-id="${postItem.postId}" data-like="${postItem.isLiked ? 'true' : ''}" data-index="${index}" class="like-button">
					<img src=${
						postItem.isLiked
								? './assets/images/like-active.svg'
								: './assets/images/like-not-active.svg'
				}>
				</button>
				<p class="post-likes-text">
				Нравится: ${
					postItem.usersLikes.length > 0
							? `${
								postItem.usersLikes[postItem.usersLikes.length - 1].name
								} ${
									postItem.usersLikes.length - 1 > 0
												? 'и ещё ' + (postItem.usersLikes.length - 1)
												: ''
								}`
							: '0'
			}
				</p>
			</div>
			<p class="post-text">
				<span class="user-name">${postItem.userName}</span>
				${postItem.description}
			</p>
			<p class="post-date">
			${postItem.postCreatedAt} назад
			</p>
		</li>`
		}).join("");
	} else {
		message = "постов нет";
	}

	/**
	 * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
	 * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
	 */

	const originHtml = `	
	<div class="page-container">
	<div class="header-container"></div>
	<ul class="posts">
	${message}
	</ul>
</div>`

	appEl.innerHTML = originHtml;

	renderHeaderComponent({
		element: document.querySelector(".header-container"),
	});

	for (let userEl of document.querySelectorAll(".post-header")) {
		userEl.addEventListener("click", () => {
			goToPage(USER_POSTS_PAGE, {
				userId: userEl.dataset.userId,
			});

		});
	}
  likeEventListener({ token: getToken() })
  likeEventListenerOnIMG({ token: getToken() })
}

export function likeEventListener() {
	const likeButtons = document.querySelectorAll('.like-button')

	likeButtons.forEach((likeButton) => {
		likeButton.addEventListener('click', (event) => {
			event.stopPropagation()
			const postId = likeButton.dataset.postId
			const index = likeButton.dataset.index
			const postHeader = document.querySelector('.post-header')
			const userId = postHeader.dataset.userId

			if (posts[index].isLiked) {
				removeLikePost({ token: getToken(), postId })
					.then(() => {
						posts[index].isLiked = false
					})
					.then(() => {
						getPosts({ token: getToken(), userId }).then(
							(response) => {
								if (page === USER_POSTS_PAGE) {
									setPosts(response)
									goToPage(USER_POSTS_PAGE, {
										userId,
									})
								} else {
									setPosts(response)
									renderApp()
								}
							},
						)
					})
			} else {
				addLikePost({ token: getToken(), postId })
					.then(() => {
						posts[index].isLiked = true
					})
					.then(() => {
						getPosts({ token: getToken(), userId }).then(
							(response) => {
								if (page === USER_POSTS_PAGE) {
									setPosts(response)
									goToPage(USER_POSTS_PAGE, {
										userId,
									})
								} else {
									setPosts(response)
									renderApp()
								}
							},
						)
					})
			}
		})
	})
}

export function likeEventListenerOnIMG() {
	const likeButtons = document.querySelectorAll('.post-image')

	likeButtons.forEach((likeButton) => {
		likeButton.addEventListener('dblclick', (event) => {
			event.stopPropagation()
			const postId = likeButton.dataset.postId
			const index = likeButton.dataset.index
			const postHeader = document.querySelector('.post-header')
			const userId = postHeader.dataset.userId

			if (posts[index].isLiked) {
				removeLikePost({ token: getToken(), postId })
					.then(() => {
						posts[index].isLiked = false
					})
					.then(() => {
						getPosts({ token: getToken(), userId }).then(
							(response) => {
								if (page === USER_POSTS_PAGE) {
									setPosts(response)
									goToPage(USER_POSTS_PAGE, {
										userId,
									})
								} else {
									setPosts(response)
									renderApp()
								}
							},
						)
					})
			} else {
				addLikePost({ token: getToken(), postId })
					.then(() => {
						posts[index].isLiked = true
					})
					.then(() => {
						getPosts({ token: getToken(), userId }).then(
							(response) => {
								if (page === USER_POSTS_PAGE) {
									setPosts(response)
									goToPage(USER_POSTS_PAGE, {
										userId,
									})
								} else {
									setPosts(response)
									renderApp()
								}
							},
						)
					})
			}
		})
	})
}
