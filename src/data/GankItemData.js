export function GankItemData(_id, createdAt, desc, publishedAt, source, type, url, used, who) {
    this._id = _id;
    this.createdAt = createdAt;
    this.desc = desc;
    this.publishedAt = publishedAt;
    this.source = source;
    this.type = type;
    this.url = url;
    this.used = used;
    this.who = who;
}