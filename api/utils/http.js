exports.convertData = (data) => {
    return data.map((res) => {
        const convertQuestions = res.questions.map((question) => {
            return {question : question.question ,
                    answers : question.answers
                }
        })
        return {...res._doc, questions : convertQuestions}
    })
}