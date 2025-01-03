import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    /**
     * Injecting postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * Inject metaOptionsRepository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  /**
   * Method to create a new post
   */
  public async create(createPostDto: CreatePostDto) {
     // Create the metaOptions first if they exist __  let
     let metaOptions = createPostDto.metaOptions
     ? this.metaOptionsRepository.create(createPostDto.metaOptions)
     : null;

   if (metaOptions) {
     await this.metaOptionsRepository.save(metaOptions);
   }
    
   // Create the post
   let post = this.postsRepository.create({
    ...createPostDto,
  });

  // If meta options exist add them to post
  if (metaOptions) {
    post.metaOptions = metaOptions;
  }

  return await this.postsRepository.save(post);
  }
  
  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        title: 'Test Tile',
        content: 'Test Content',
      },
      {
        user: user,
        title: 'Test Tile 2',
        content: 'Test Content 2',
      },
    ];
  }
}