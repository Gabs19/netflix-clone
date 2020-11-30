import React, {useEffect, useState} from 'react'
import './App.css'
import TMDB from './TMDB'
import MovieRow from './components/MovieRow'
import FeaturedMovie from './components/Featured'
import Header from './components/Header'

// useEffect - quando a tela for executada ao ser chamada.

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

  const [movieList, setMovieList] = useState([])
  const [featuredData, setFeaturedData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)


  useEffect(() => {
    const loadAll = async () => {
      //pegando lista total
      let list = await TMDB.getHomeList()
      setMovieList(list)

      //pegando filme em destaque
      let featured = list.filter(i => i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (featured[0].items.results.length -1))
      let chosen = featured[0].items.results[randomChosen]
      let chosenInfo = await TMDB.getMovieInfo(chosen.id, 'tv')
      setFeaturedData(chosenInfo)
    }

    loadAll()
  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }

    window.addEventListener('scroll', scrollListener)
    
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])


  return (
    <div className = 'page'>
      <Header black = {blackHeader}/>
      <main>

        {featuredData && <FeaturedMovie item = {featuredData} />}

        <section className = 'lists'>
          {movieList.map((item,key) => (
            <MovieRow key = {key} title = {item.title} items = {item.items}/>
            ))}
        </section>
      </main>
      <footer>
        Direitos de Imagem da NetFlix
      </footer>
            
      {movieList.length <= 0 &&
      <div className = 'loading'>
        <img src = 'https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_2560%2Cc_limit/Netflix_LoadTime.gif' alt = 'Carregando'/>
      </div>
      }
    </div>
  )
}