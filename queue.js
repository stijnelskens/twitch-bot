// Loops and calls each function in a queue
export default function Queue() {
    let queue = [];
    let isLooping = false;
    let isPaused = false;

    this.loop = async () => {
        isLooping = true;

        const item = queue[0];
        queue.shift();
        await item();

        if (!queue.length || isPaused) {
            isLooping = false;
            return;
        }

        this.loop();
    };

    this.add = item => {
        if (isPaused) return;

        queue.push(item);

        if (!isLooping) this.loop();
    };

    this.clear = () => {
        queue = [];
    };

    this.pause = (duration = 0) => {
        isPaused = true;
        setTimeout(() => (isPaused = false), duration);
    };

    this.isLooping = isLooping;
}

// export default class Queue {
   
//     constructor(){
      
//       this.data = [];
//       this.rear = 0;
//       this.size = 20;
//     }
    
//     enqueue(element) {
//         if (this.rear < this.size) {
//            this.data[this.rear] = element;
//            this.rear = this.rear + 1;
//         }
//    }
//    length() {
     
//       return this.rear;
//    }
//    isEmpty() {
    
//      return this.rear === 0;
//    }
//    getFront() {
    
//      if(this.isEmpty() === false) {
//          return this.data[0];
//      }
//    }
//    getLast() {
     
//       if(this.isEmpty() === false) {
        
//            return this.data[ this.rear - 1 ] ;
//       }
//    }
//    dequeue() {
    
//       if(this.isEmpty() === false) {
           
//            this.rear = this.rear-1;
//            return this.data.shift();
//       }
//    }
//    print() { 
//     for(let i =0; i < this.rear; i++) {
//        console.log(this.data[i]);
//      }
//    }
//     clear() {
//        this.data.length = 0;
//        this.rear = 0;
//     }
//  }