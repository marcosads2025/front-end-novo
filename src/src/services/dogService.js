import axios from 'axios';

// A URL base da sua API (Back-end)
// Certifique-se de que esta é a URL correta do seu servidor Express
const API_URL = 'http://localhost:3000/dogs';

/**
 * Busca todos os cachorros cadastrados no banco de dados.
 * @returns {Promise<Array>} Lista de objetos de cachorros.
 */
export const getDogs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os cachorros:", error);
    // Propaga o erro para ser tratado no componente que chamou
    throw error;
  }
};

/**
 * Cadastra um novo cachorro no banco de dados.
 * @param {object} dogData - Dados do cachorro a ser criado.
 * @returns {Promise<object>} O objeto do cachorro criado.
 */
export const createDog = async (dogData) => {
  try {
    const response = await axios.post(API_URL, dogData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar o cachorro:", error);
    throw error;
  }
};

/**
 * Deleta um cachorro por ID.
 * @param {string} id - O ID do cachorro a ser deletado.
 * @returns {Promise<void>}
 */
export const deleteDog = async (id) => {
  try {
    // Retorna a resposta da requisição DELETE
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar o cachorro:", error);
    throw error;
  }
};
