import { getLogInput, CreateLogInput, LogModel } from "schema/log.schema";

class LogService {
  static async createLog(input: CreateLogInput) {
    return LogModel.create(input);
  }

  static async getLogs(input: getLogInput) {
    const {event, date, user_id} = input
    if (event) {
      return LogModel.find().findByLogEventType(event);
    }
    return null;
  }
  
}

export default LogService;