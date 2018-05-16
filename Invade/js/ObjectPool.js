/* The object to be held within the Object Pool.
*/
// function Obj() {
//     this.inUse = false; // Is true if the object is currently in use
//     /*
//      * Sets an object not in use to default values
//      */
//     this.init = function (/*values*/) {
//         /*code to initialize object to default values*/
//     };
//     /*
//      * Spawn an object into use
//      */
//     this.spawn = function (/*values if any*/) {
//         /*code to set values if any*/
//         this.inUse = true;
//     }
//     /*
//      * Use the object. Return true if the object is ready to be
//      * cleared (such as a bullet going of the screen or hitting
//      * an enemy), otherwise return false.
//      */
//     this.use = function () {
//         if (/*object is ready to be reused*/) {
//             return true;
//         } else {
//             /*code to use object*/
//             return false;
//         }
//     };
//     /*
//      * Resets the object values to default
//      */
//     this.clear = function () {
//         /*code to reset values*/
//         this.inUse = false;
//     };
// }
/**
 * The Object Pool. Unused objects are grabbed from the back of
 * the array and pushed to the front of the array. When using an
 * object, if the object is ready to be removed, it splices the
 * array and pushes the object to the back to be reused.
 */
export default class Pool {
    constructor() {
        this.size = 30; // Max objects allowed in the pool
        this.pool = [];
    }
    /*
     * Populates the pool array with objects
     */
    Init(ObjFactory) {
        for (let i = 0; i < this.size; i++) {
            // Initialize the objects
            let obj = ObjFactory();
            obj.Init(/*values*/);
            this.pool[i] = obj;
        }
    };
    /*
     * Grabs the last item in the list and initializes it and
     * pushes it to the front of the array.
     */
    Get(/*values*/) {
        // If the last item in the array is in use, the pool is full
        if (!this.pool[this.size - 1].inUse) {
            this.pool[this.size - 1].spawn(/*values if any*/);
            this.pool.unshift(this.pool.pop());
        }
    };
    /*
     * Uses any alive objects in the pool. If the call returns true,
     * the object is ready to be cleared and reused.
     */
    Use() {
        for (let i = 0; i < this.size; i++) {
            // Only use objects that are currently in use
            if (this.pool[i].inUse) {
                if (this.pool[i].use()) {
                    this.pool[i].clear();
                    this.pool.push((this.pool.splice(i, 1))[0]);
                }
            } else {
                // The first occurrence of an unused item we can
                // break looping over the objects.
                break;
            }
        }
    };
}