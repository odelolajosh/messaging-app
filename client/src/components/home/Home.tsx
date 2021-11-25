import React, { useContext, useEffect } from "react";
import { bars, search } from "../../assets/icon";
import { NavContext } from "../../contexts/NavControl";
import "./home.css";

const Home: React.FC = () => {
    const { setToggle } = useContext(NavContext); 
    useEffect(() => setToggle(false), [setToggle]);

    return (
        <main id="youchat-home">
            <section className="feed-sc">
                <div className={`top-sc`}>
                    <section className="stories-sc">
                        <h2> 
                            <div onClick={() => setToggle(true)}>{ bars }</div>
                            Stories
                        </h2>
                        <div className="stories">
                            <div>
                            { [0, 0, 0, 0, 0].map((s, i) => <span className="story" key={`${i}`}></span>) }
                            </div>
                        </div>
                    </section>
                    <div 
                        className="mn-search">
                        <span>{ search }</span>
                        <input placeholder="Search for user, post, tag ..." />
                    </div>
                </div>
                <div className="main-sc">
                </div>
            </section>
            <section className="alt-sc">
            </section>
        </main>
    )
}

export default Home;