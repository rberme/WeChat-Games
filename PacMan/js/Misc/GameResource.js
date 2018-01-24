import Static from "../Utility/Static"
var Stat = new Static();
export default class GameResource {
    constructor() {
        let image = null;
        Stat.gameResource = [];
        image = wx.createImage(); image.src = "images/altas.png";
        Stat.gameResource.push(image);//0
        image = wx.createImage(); image.src = "images/pacman.png";
        Stat.gameResource.push(image);
        image = wx.createImage(); image.src = "images/ghosts.png";
        Stat.gameResource.push(image);
        // image = new Image(); image.src = "images/Tileset/Tree.png";
        // Stat.gameResource.push(image);
        // image = new Image(); image.src = "images/Tileset/BlackTile.png";
        // Stat.gameResource.push(image);
        // image = new Image(); image.src = "images/Tileset/type1BrownBlock.png";
        // Stat.gameResource.push(image);
    }
}