import {System} from "./Firebase/system.js"
import {update, ref, onValue} from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js';

// This class contains many primary algorithms that are mainly used for merrge sorting
class Algorithms
  {
    constructor()
    {
      // Instantiating the system class to save values into our database
      this.system = new System();

      // These methods help save the values from our database into arrays
      this.initializeDatabase();
      this.storingDBPropertiesIntoArrays();

    }
    // This method is used to take a specific chunk out of an array using start and end
    spliceArray(arr, start, end)
    {
      let splitArray = [];

      for (let i = 0; i < end-start; i++)
      {
        splitArray[i] = arr[start+i];
      }
      return splitArray;
    }
    // This method is used to put 3 arrays together
    concatenateArrays(sortedArr, arr1, arr2)
    {
      let resultant = [];
      
      for(let i = 0; i < sortedArr.length; i++) 
      {
        resultant[i] = sortedArr[i];
      }
      
      for(let i = 0; i < arr1.length; i++) 
      {
        resultant[i + sortedArr.length] = arr1[i];
      }
     
      for(let i = 0; i < arr2.length; i++) 
      {
        resultant[i + sortedArr.length + arr1.length] = arr2[i];
      }
      return resultant;
    }

    // This method is used to shift an entire array to the left and delete the first element
    shiftArrayLeft(arr)
    {
      for (let i = 1; i < arr.length; i++)
      {
        arr[i-1] = arr[i];
      }
      arr.length--;
  
      return arr;
    }
    
    // This method compares the individual elements of the arrays together to sort them accordingly
    merge(arr1, arr2)
    {
      let sorted = [];
      let friendArray=[];
      let sortedElement = 0;
      
      while (arr1[0].length !== 0 && arr2[0].length !== 0) 
      {
        let array;
        
        if (arr1[0][0] > arr2[0][0]) 
        {
          array = arr1;
          sorted[sortedElement] = arr1[0][0];
          friendArray[sortedElement] = arr1[1][0];
        } 
        else 
        {
          array = arr2;
          sorted[sortedElement] = arr2[0][0];
          friendArray[sortedElement] = arr2[1][0];
        }
        this.shiftArrayLeft(array[0]);
        this.shiftArrayLeft(array[1]);
        sortedElement++;
      }
      return [this.concatenateArrays(sorted, arr1[0],arr2[0]), this.concatenateArrays(friendArray, arr1[1],arr2[1])];
    }
    
    // This method splits the elements of 2 arrays into individual elements
    mergeSort(arr, accomplice)
    {
      if (arr.length <= 1) 
      {
        return [arr, accomplice];
      }
     
      let mid = Math.floor(arr.length/2);
      let left = this.mergeSort(this.spliceArray(arr,0, mid), this.spliceArray(accomplice,0, mid));
      
      let right = this.mergeSort(this.spliceArray(arr,mid, arr.length), this.spliceArray(accomplice,mid,accomplice.length));
      
      return this.merge(left, right, accomplice);
    }

    // This method takes players and scores as an input and formats them appropriately for the leaderboard
    formatLeaderboard(players, scores)
    {
      let stringResult = '';
      let place = 1;

      if (players.length !== 0)
      {
        for (let i = 0; i< players.length; i++)
        {
          stringResult += place + '.) ' + players[i] + ' - ' + scores[i] + '\n';
          place++;
          // As soon as there are 10 players on the leaderboard, stop listing more players
          if (i === 9)
          {
            return stringResult;
          }
        }
      }
      return stringResult;    
    }
    // This method should be called when new values are pushed into player and score arrays
    updateLeaderboard(players, scores)
    {
      let list = document.getElementById('leaderBoardList');
      list.innerText = '';
      list.innerText = this.formatLeaderboard(players, scores);
    }
    // Initializing the database with a property to track the number of players stored
     initializeDatabase()
    {
      onValue(ref(this.system.db, "/leaderBoardInfo/playerNumber"),(snapshot) => {
        if (snapshot.val() === null)
        {
          update(ref(this.system.db, "/"), {
            ['leaderBoardInfo']: {
              playerNumber: 0
            }
          })
        }
          
      },{onlyOnce: true} )
    }
    
    // Storing user info as individual objects which include name and score
    updateUserObjects(player, score)
    {
      onValue(ref(this.system.db, "/leaderBoardInfo/playerNumber"),(snapshot) => {
        
        update(ref(this.system.db, "/"), {
        [`leaderBoardInfo/${snapshot.val() }`]:{
          name: player,
          score: score
        },
        [`leaderBoardInfo/playerNumber`]: snapshot.val() + 1,  
      })
      },{onlyOnce: true}) 

      this.storingDBPropertiesIntoArrays();
    }

    // This method pushes the players and scores from our database into 2 arrays, which are then used to format the leaderboard
    storingDBPropertiesIntoArrays()
    {
      this.players = [];
      this.scores = [];
      onValue(ref(this.system.db, "/leaderBoardInfo"), (snapshot) => {
        for (let i=0; i < Object.keys(snapshot.val()).length-1; i++)
          {
            this.players.push(snapshot.val()[i].name);
            this.scores.push(snapshot.val()[i].score);
          }
        let sortedArrays = this.mergeSort(this.scores, this.players);
        this.players = sortedArrays[1];
        this.scores = sortedArrays[0];
    
        this.updateLeaderboard(this.players, this.scores);
      }) 
    }  
}

export { Algorithms };


// This class is instantiated in the Canvas class and is used to update 
// The leaderboard when we need to 