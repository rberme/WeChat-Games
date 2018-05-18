


/*
  常量：
  - MAX_OBJECTS: 每个节点（象限）所能包含物体的最大数量
  - MAX_LEVELS: 四叉树的最大深度
*/

/* 
  四叉树节点包含：
  - objects: 用于存储物体对象
  - nodes: 存储四个子节点
  - level: 该节点的深度，根节点的默认深度为0
  - bounds: 该节点对应的象限在屏幕上的范围，bounds是一个矩形
*/
export default class QaudTree {
    constructor(bounds, level) {
        this.MAX_OBJECTS = 2;
        this.MAX_QUADLVS = 5;
        this.objects = [];
        this.nodes = [];
        this.level = typeof level === 'undefined' ? 0 : level;
        this.bounds = bounds;
    }

    /* 
      获取物体对应的象限序号，以屏幕中心为界限，切割屏幕:
      - 右上：象限一
      - 左上：象限二
      - 左下：象限三
      - 右下：象限四
    */
    getIndex(obj) {
        let rect = obj.rect;
        let bounds = this.bounds;
        let onTop = rect[1] + rect[3] <= (bounds[1] + (bounds[3] >> 1)),
            onBottom = rect[1] >= (bounds[1] + (bounds[3] >> 1)),
            onLeft = rect[0] + rect[2] <= (bounds[0] + (bounds[2] >> 1)),
            onRight = rect[0] >= (bounds[0] + (bounds[2] >> 1))

        if (onTop) {
            if (onRight) {
                return 0;
            } else if (onLeft) {
                return 1;
            }
        } else if (onBottom) {
            if (onLeft) {
                return 2;
            } else if (onRight) {
                return 3;
            }
        }

        // 如果物体跨越多个象限，则放回-1
        return -1;
    }


    // 划分
    split() {
        let level = this.level,
            bounds = this.bounds,
            x = bounds[0],
            y = bounds[1],
            sWidth = (bounds[2] >> 1),//bounds.width / 2,
            sHeight = (bounds[3] >> 1)//bounds.height / 2;

        this.nodes.push(
            new QaudTree([x + sWidth, y, sWidth, sHeight], level + 1),
            new QaudTree([x, y, sWidth, sHeight], level + 1),
            new QaudTree([x, y + sHeight, sWidth, sHeight], level + 1),
            new QaudTree([x + sWidth, y + sHeight, sWidth, sHeight], level + 1)
        );
    };

    /*
      插入功能：
        - 如果当前节点[ 存在 ]子节点，则检查物体到底属于哪个子节点，如果能匹配到子节点，则将该物体插入到该子节点中
        - 如果当前节点[ 不存在 ]子节点，将该物体存储在当前节点。随后，检查当前节点的存储数量，如果超过了最大存储数量，则对当前节点进行划分，划分完成后，将当前节点存储的物体重新分配到四个子节点中。
    */
    insert(obj) {
        let objs = this.objects,
            i, index;

        // 如果该节点下存在子节点
        if (this.nodes.length) {
            index = this.getIndex(obj);
            if (index !== -1) {
                this.nodes[index].insert(obj);
                return;
            }
        }

        // 否则存储在当前节点下
        objs.push(obj);

        // 如果当前节点存储的数量超过了MAX_OBJECTS
        if (!this.nodes.length &&
            this.objects.length > this.MAX_OBJECTS &&
            this.level < this.MAX_QUADLVS) {

            this.split();

            for (i = objs.length - 1; i >= 0; i--) {
                let index = this.getIndex(objs[i]);
                if (index !== -1) {
                    this.nodes[index].insert(objs.splice(i, 1)[0]);
                }
            }
        }
    };


    /*
      检索功能：
        给出一个物体对象，该函数负责将该物体可能发生碰撞的所有物体选取出来。该函数先查找物体所属的象限，该象限下的物体都是有可能发生碰撞的，然后再递归地查找子象限...
    */
    // 检索
    retrieve(obj) {
        let result = [],
            arr, i, index;

        if (this.nodes.length) {
            index = this.getIndex(obj);
            if (index !== -1) {
                result = result.concat(this.nodes[index].retrieve(obj));
                // } else {

                //     // 切割矩形
                //     arr = rect.carve(this.bounds);

                //     for (i = arr.length - 1; i >= 0; i--) {
                //         index = this.getIndex(arr[i]);
                //         resutl = result.concat(this.nodes[index].retrieve(obj));

                //     }
            }
        }

        result = result.concat(this.objects);
        return result;
    }

    Render(gameRes) {
        gameRes.DrawRect(this.bounds, "red");
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].Render(gameRes);
        }
    }
}

