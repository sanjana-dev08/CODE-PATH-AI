const notFound = (req, res) => res.status(404).json({
	success: false,
	message: `Route not found: ${req.method} ${req.originalUrl}`,
});

const errorHandler = (error, req, res, next) => {
	if (res.headersSent) return next(error);
	console.error(error.message);
	return res.status(error.status || 500).json({
		success: false,
		message: error.status ? error.message : "An unexpected server error occurred",
	});
};

module.exports = { notFound, errorHandler };
