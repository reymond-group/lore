Lore.Cloud = function() {
    Lore.Node.call(this);
    this.type = 'Lore.Cloud';
}

Lore.Cloud.prototype = Object.assign(Object.create(Lore.Node.prototype), {
    constructor: Lore.Cloud
});
