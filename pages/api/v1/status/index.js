function status(request, response) {
  response.status(200).json({ teste: "teste" });
}

export default status;
