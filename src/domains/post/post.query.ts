import { PostTemplate } from "@common/models/postTemplate.model";
import { User } from "@common/models/user.model";

export const postTemplateQuery = {
  selectTemplates: {
    id: PostTemplate.id,
    name: PostTemplate.name,
    content: PostTemplate.content,
    category: PostTemplate.category,
    isPublic: PostTemplate.isPublic,
    favoriteCount: PostTemplate.favoriteCount,
    createdAt: PostTemplate.createdAt,
    updatedAt: PostTemplate.updatedAt,
    author: { id: User.id, nickname: User.nickname },
  },
};
