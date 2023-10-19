import React, { useEffect, useState } from 'react'
import Post from './Feed/Post'
import CreatePostPopup from '../utils/CreatePostPopup';
import axios from 'axios';

// Backend ke baad ich wala prop hat jayega
const Middle = ({posts}) => {
    const [currentMode, setCurrentMode] = useState('normal');
    // Backend Connection ke baad niche ki do line comment out ho jayegi
    const anonymousPosts = posts.filter((post) => post.isAnonymous);
    const normalPosts = posts.filter((post) => !post.isAnonymous);
    const [generalposts, setGeneralPosts] = useState([]);
    const [anonymousposts, setAnonymousPosts] = useState([]);
    const [postId, setPostId] = useState(null)
  
    const userData = JSON.parse(localStorage.getItem('userData'));
    const sessionToken = userData ? userData.token : null;
  
    const fetchgeneralposts = async() => {
      const response = await axios.get('http://127.0.0.1:8000/post/general/', {
        headers: {
          Authorization: `Token ${sessionToken}`,
        },
      });
      const id = response.data.id;
      setPostId(id);

      setGeneralPosts(response);
    }

    const fetchanonymousposts = async() => {
        const response = await axios.get('http://127.0.0.1:8000/post/anonymous/', {
          headers: {
            Authorization: `Token ${sessionToken}`,
          },
        });
        setAnonymousPosts(response);
      }

    //   useEffect( () => {
    //     fetchgeneralposts();
    //     fetchanonymousposts();
    //   },[CreatePostPopup])
  return (
    <>
        <main className='flex h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-black'>
            <div className='p-2 backdrop-blur z-10 bg-white/10 sticky top-0'>
                <div className="mb-4">
                        <button
                            className={`mr-2 px-4 py-2 ${
                                currentMode === 'normal' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                            } rounded`}
                            onClick={() => setCurrentMode('normal')}
                        >
                            Normal Posts
                        </button>
                        <button
                        className={`px-4 py-2 ${
                            currentMode === 'anonymous' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                        } rounded`}
                        onClick={() => setCurrentMode('anonymous')}
                        >
                            Anonymous Posts
                        </button>
                    </div>                
            </div>
                {currentMode === 'normal' && (
                    <div>
                        {normalPosts.map((post) => (
                            <div key={post.id}>
                                    <Post post={post} />
                                {/* <p className="text-gray-500 mt-2">{post.timestamp}</p> */}
                            </div>
                        ))}
                        {/* Backend Connection ke baad */}
                        {generalposts.map((post) => (
                            <div key={post.id}>
                                    <Post post={post} />
                                {/* <p className="text-gray-500 mt-2">{post.timestamp}</p> */}
                            </div>
                        ))}
                    </div>
                )}

                {currentMode === 'anonymous' && (
                    <div>
                        {anonymousPosts.map((post) => (
                            <div key={post.id}>
                                <Post post={post} />
                                {/* <p className="text-gray-500 mt-2">{post.timestamp}</p> */}
                            </div>
                        ))}
                        {/* Backend Connection ke baad */}
                        {anonymousposts.map((post) => (
                            <div key={post.id}>
                                    <Post post={post} postId={`${postId}`} />
                                {/* <p className="text-gray-500 mt-2">{post.timestamp}</p> */}
                            </div>
                        ))}
                    </div>
                )}
        </main>
    </>
  )
}

export default Middle 