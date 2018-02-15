BASE_DIR=$(cd "$(dirname "$0")"; pwd)

pushd "${BASE_DIR}/../test"
tsc
popd
