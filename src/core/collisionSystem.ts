import { type BoundingBox, hitAABB } from "../utils/hitAABB";

type Collisionable = {
  sprite: {
    getBounds: () => BoundingBox;
  };
};

export class CollisionSystem {
  check<T extends Collisionable>(
    target: BoundingBox,
    colls: readonly T[],
    onCollision: (coll: T) => void
  ) {
    colls.forEach((coll) => {
      if (hitAABB(target, coll.sprite.getBounds())) {
        onCollision(coll);
      }
    });
  }
}
