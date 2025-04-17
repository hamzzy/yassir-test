import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AirqualityDocument = Airquality & Document;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Airquality {
  @Prop()
  ts: Date;

  @Prop()
  aqius: number;

  @Prop()
  mainus: string;

  @Prop()
  aqicn: number;

  @Prop()
  maincn: string;

  @Prop()
  location: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const AirQualitySchema = SchemaFactory.createForClass(Airquality);

