import Phaser from 'phaser';
import {useState,useEffect} from 'react';
import Escena from "./component/Escena";
function App() {
  //use state de una variable listo, si no usamos esto los lienzos se acumalar e la vista
  const [listo,setListo]= useState(false);
  //usamos el hook para que renderice acciones que ract no hace
  useEffect(()=>{
    var config={
      type: Phaser.AUTO,
      width:800,
      height:600,
      physics:{
        default:'arcade',
        arcade:{
          gravity:{y:100},
          debug:false
        }
      },
      scene:[Escena]
      /**scene: {
        preload:preload,
        create:create
      }*/
    };
    //Arranca el juego
    var game= new Phaser.Game(config);
    //Trigger cuando el juego esta completamente listo
    game.events.on("LISTO",setListo)
    //Si no pongo esto, se acumulan duplicados del lienzo
    return()=>{
      setListo(false);
      game.destroy(true);
    }
  },[listo]);
}
export default App;
