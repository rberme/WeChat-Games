

let instance
export default class JoyStick {
    constructor() {
        if (instance)
            return instance
        instance = this

        this.joyBack = wx.createImage();
        this.joyBack.src = "images/joystick.png";
        this.joyHandle = wx.createImage();
        this.joyHandle.src = "images/joyhandle.png";
        this.radius = 42;
        this.backWidth = 128//this.joyBack.width;
        this.handleWidth = 64//this.joyHandle.width;
        this.SetPosition(200, 300);
    }

    SetPosition(x, y) {
        this.x = x;
        this.y = y;
        this.handleX = x;
        this.handleY = y;

        this.dirValueX = 0;
        this.dirValueY = 0;
    }

    GetDirection() {
        return [this.dirValueX, this.dirValueY];
    }

    reset() {
        this.x = this.y = this.handleX = this.handleY = 0;
        this.dirValueX = this.dirValueY = 0;
    }
    SetHandlePosition(_x, _y) {
        //i = 0x5f3759df-(i>>1) 快速开方

        let dirX = this.x - _x;
        let dirY = this.y - _y;


        if (Math.abs(dirX) > 0.0001 || Math.abs(dirY) > 0.0001) {
            let dist = Math.sqrt(dirX * dirX + dirY * dirY);
            this.dirValueX = dirX = dirX / dist;
            this.dirValueY = dirY = dirY / dist;
            if (dist < this.radius / 3)
                this.dirValueX = this.dirValueY = 0;
            dist = Math.min(dist, this.radius)
            this.handleX = this.x - dirX * dist;
            this.handleY = this.y - dirY * dist;
            // this.x = _x + dirX * dist;
            // this.y = _y + dirY * dist;
        }
        // this.handleX = _x;
        // this.handleY = _y;


        // if (Math.abs(dirX) > 0.0001 || Math.abs(dirY) > 0.0001) {
        //     let dist = Math.sqrt(dirX * dirX + dirY * dirY);
        //     this.dirValueX = dirX = dirX / dist;
        //     this.dirValueY = dirY = dirY / dist;
        //     if(dist<this.radius/3)
        //         this.dirValueX = this.dirValueY = 0;
        //     dist = Math.min(dist, this.radius)
        //     this.x = _x + dirX * dist;
        //     this.y = _y + dirY * dist;
        // }
        // this.handleX = _x;
        // this.handleY = _y;

    }


    render(ctx) {
        ctx.drawImage(
            this.joyBack,
            this.x - this.backWidth / 2,
            this.y - this.backWidth / 2,
            this.backWidth,
            this.backWidth
        )

        ctx.drawImage(
            this.joyHandle,
            this.handleX - this.handleWidth / 2,
            this.handleY - this.handleWidth / 2,
            this.handleWidth,
            this.handleWidth
        )
    }

}