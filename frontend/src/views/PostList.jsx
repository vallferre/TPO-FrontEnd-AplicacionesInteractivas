import { useEffect, useState } from 'react'
import PostCard from './PostCard'

const PostList = () => {
    const [posts, setPosts] = useState([])
    const URL = "http://localhost:3000/api/posts"

    useEffect(() => {
        fetch(URL)
        .then((response) => response.json())
        .then((data) => setPosts(data))
        .catch((error) => {throw Error(error)})
    }, [])
    return (
        <>
            <h1>Publicaciones</h1>
            <div>
                {
                    posts.map((post) => (
                        <PostCard 
                        id={post.id}
                        title={post.title}
                        body={post.body}
                        key = {post.id}
                        />
                    ))
                }
            </div>
        </>
    )
}

export default PostList

//LOGIN o REGISTER
localStorage.setItem('jwtToken', data.token);

const token = localStorage.getItem('jwtToken');

const [form, setForm] = useState({name: '', email: '', password: ''});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(form)
};

useEffect(() => {
    fetch(`${URL}products`, options)
    .then((response) => response.json())
    .then((data) => {setPosts([...posts, {data}])})
    .catch((error) => {throw Error(error)})
}, [])