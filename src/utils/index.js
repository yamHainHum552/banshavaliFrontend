export const buildTree = (data) => {
  const map = new Map();

  data.forEach((item) => {
    map.set(item._id, { ...item, children: [] });
  });

  const tree = [];
  data.forEach((item) => {
    if (item.parent) {
      const parent = map.get(item.parent);
      if (parent) {
        parent.children.push(map.get(item._id));
      }
    } else {
      tree.push(map.get(item._id));
    }
  });

  return tree;
};
