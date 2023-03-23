import { configuration } from '../../utils/constants'
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIApi } from 'openai'

type Data = {
  result: unknown
}

const openai = new OpenAIApi(configuration)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { textInput } = req.body
  console.log('input', textInput)

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `filtre apenas os nomes de pessoas dessa conversa, seguido da idade, localização (se houver), e telefone (se houver), excluindo os rementes. Seguindo esse padrão: nome - idade - localização - telefone, mas nunca terminando com -. \n\n ${textInput}`,
    temperature: 0.9,
    max_tokens: 300,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6
  })

  const suggestion = response.data?.choices[0].text

  if (suggestion === undefined) throw new Error('No suggestion found')

  res.status(200).json({ result: suggestion })
  console.log(suggestion)
}
