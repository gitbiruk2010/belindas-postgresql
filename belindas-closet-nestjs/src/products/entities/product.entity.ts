import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ProductType, ProductGender, ProductSizes, ShoeSize, PantsSize } from '../enums';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.createdProducts, { nullable: false })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @ManyToOne(() => User, user => user.updatedProducts, { nullable: true })
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedByUser: User;

  @Column({
    type: 'enum',
    enum: ProductType
  })
  productType: ProductType;

  @Column({
    type: 'enum',
    enum: ProductGender,
    nullable: true
  })
  productGender: ProductGender;

  @Column({
    type: 'varchar',
    nullable: true
  })
  productSizeShoe: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  productSizes: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  productSizePantsWaist: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  productSizePantsInseam: string;

  @Column({ type: 'text', nullable: true })
  productDescription: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  productImage: string;

  @Column({ type: 'boolean', default: false })
  isHidden: boolean;

  @Column({ type: 'boolean', default: false })
  isSold: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
