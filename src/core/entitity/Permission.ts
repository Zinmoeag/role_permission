class Permission {
  constructor(data: any) {
    return {
      id: data.id,
      resource: data.resource,
      action: data.action,
    };
  }
}

export default Permission;
